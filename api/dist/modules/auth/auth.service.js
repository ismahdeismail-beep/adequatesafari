"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const uuid_1 = require("uuid");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.usersService.create({
            email: dto.email,
            passwordHash,
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            role: dto.role || 'CUSTOMER',
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.saveRefreshToken(user.id, tokens.refreshToken);
        this.logger.log(`User registered: ${user.email}`);
        return { user: this.sanitizeUser(user), ...tokens };
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.saveRefreshToken(user.id, tokens.refreshToken);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        this.logger.log(`User logged in: ${user.email}`);
        return { user: this.sanitizeUser(user), ...tokens };
    }
    async refresh(refreshToken) {
        const tokenRecord = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });
        if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        await this.prisma.refreshToken.update({
            where: { id: tokenRecord.id },
            data: { revokedAt: new Date() },
        });
        const tokens = await this.generateTokens(tokenRecord.user.id, tokenRecord.user.email, tokenRecord.user.role);
        await this.saveRefreshToken(tokenRecord.user.id, tokens.refreshToken);
        return tokens;
    }
    async logout(userId, refreshToken) {
        if (refreshToken) {
            await this.prisma.refreshToken.updateMany({
                where: { token: refreshToken, userId },
                data: { revokedAt: new Date() },
            });
        }
        else {
            await this.prisma.refreshToken.updateMany({
                where: { userId, revokedAt: null },
                data: { revokedAt: new Date() },
            });
        }
        this.logger.log(`User logged out: ${userId}`);
    }
    async validateUser(userId) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        return this.sanitizeUser(user);
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = (0, uuid_1.v4)();
        const expiresIn = this.jwtService.sign(payload, { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }
    async saveRefreshToken(userId, token) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await this.prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });
    }
    sanitizeUser(user) {
        const { passwordHash, ...rest } = user;
        return rest;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map