import { SyncService } from './sync.service';
export declare class SyncController {
    private syncService;
    constructor(syncService: SyncService);
    syncJoomla(): Promise<{
        created: number;
        updated: number;
        errors: number;
    }>;
    syncUsers(): Promise<{
        created: number;
        updated: number;
    }>;
    pushBooking(id: string): Promise<void>;
}
