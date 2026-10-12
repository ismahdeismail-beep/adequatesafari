import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { Prisma } from '@prisma/client';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date | null;
    }>;
    updateProfile(req: any, data: Prisma.UserUpdateInput): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date | null;
    }>;
    changePassword(req: any, data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    listUsers(skip?: number, take?: number, role?: Role, isActive?: boolean): Promise<{
        data: {
            id: string;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date | null;
        }[];
        total: number;
    }>;
    getUser(id: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date | null;
    }>;
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt: Date | null;
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
