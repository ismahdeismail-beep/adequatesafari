import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        passwordHash: string;
        firstName: string;
        lastName: string;
        phone?: string;
        role?: Role;
    }): Promise<any>;
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<{
        data: any;
        total: any;
    }>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<any>;
    updatePassword(id: string, newPasswordHash: string): Promise<any>;
    verifyEmail(id: string): Promise<any>;
    deactivate(id: string): Promise<any>;
    activate(id: string): Promise<any>;
    delete(id: string): Promise<any>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<any>;
}
