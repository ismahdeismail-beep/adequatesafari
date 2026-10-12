import { PrismaService } from '../../prisma/prisma.service';
import { SyncStatus } from '@prisma/client';
export interface WebhookEvent {
    event: string;
    timestamp: string;
    data: any;
    source: 'joomla' | 'stripe' | 'mpesa' | 'internal';
}
export declare class WebhooksService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    processEvent(event: WebhookEvent): Promise<void>;
    private logEvent;
    private handleSafariSync;
    private handleSafariDelete;
    private handleBookingSync;
    private handleUserSync;
    private handlePaymentSync;
    private updateSyncLog;
    private mapJoomlaSafari;
    private mapCountry;
    private mapAccommodation;
    private mapSafariStyle;
    getSyncLogs(params: {
        skip?: number;
        take?: number;
        entityType?: string;
        status?: SyncStatus;
        startDate?: Date;
        endDate?: Date;
    }): Promise<{
        data: any;
        total: any;
    }>;
    retryFailedSyncs(entityType?: string): Promise<{
        retried: any;
    }>;
}
