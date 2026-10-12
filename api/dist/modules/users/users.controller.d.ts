import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { Prisma } from '@prisma/client';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, data: Prisma.UserUpdateInput): Promise<any>;
    changePassword(req: any, data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    listUsers(skip?: number, take?: number, role?: Role, isActive?: boolean): Promise<{
        data: any;
        total: any;
    }>;
    getUser(id: string): Promise<any>;
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<any>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
