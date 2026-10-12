import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private prisma;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken?: string): Promise<void>;
    validateUser(userId: string): Promise<any>;
    private generateTokens;
    private saveRefreshToken;
    private sanitizeUser;
}
