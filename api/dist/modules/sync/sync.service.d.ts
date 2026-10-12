import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { SafarisService } from '../safaris/safaris.service';
import { UsersService } from '../users/users.service';
export declare class SyncService {
    private config;
    private prisma;
    private safarisService;
    private usersService;
    private readonly logger;
    constructor(config: ConfigService, prisma: PrismaService, safarisService: SafarisService, usersService: UsersService);
    syncFromJoomla(): Promise<{
        created: number;
        updated: number;
        errors: number;
    }>;
    private fetchJoomlaArticles;
    private mapArticleToSafari;
    syncUsersFromJoomla(): Promise<{
        created: number;
        updated: number;
    }>;
    pushBookingToJoomla(bookingId: string): Promise<void>;
    private mapCountry;
    private mapAccommodation;
    private mapSafariStyle;
    private mapJoomlaRole;
}
