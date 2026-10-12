import { WebhooksService } from './webhooks.service';
import { SyncStatus } from '@prisma/client';
export declare class WebhooksController {
    private webhooksService;
    constructor(webhooksService: WebhooksService);
    joomlaWebhook(body: any): Promise<void>;
    internalWebhook(body: {
        event: string;
        data: any;
    }): Promise<void>;
    getSyncLogs(skip?: number, take?: number, entityType?: string, status?: SyncStatus, startDate?: string, endDate?: string): Promise<{
        data: any;
        total: any;
    }>;
    retryFailed(body: {
        entityType?: string;
    }): Promise<{
        retried: any;
    }>;
}
