import { SafarisService } from './safaris.service';
import { Country, SafariStyle, AccommodationType } from '@prisma/client';
import { Prisma } from '@prisma/client';
export declare class SafarisController {
    private safarisService;
    constructor(safarisService: SafarisService);
    list(skip?: number, take?: number, country?: Country, safariStyle?: SafariStyle, accommodationType?: AccommodationType, minPrice?: number, maxPrice?: number, durationDays?: number, isFeatured?: boolean, search?: string, availableFrom?: string, availableTo?: string): Promise<{
        data: any;
        total: any;
    }>;
    featured(limit?: number): Promise<any>;
    byCountry(country: Country, limit?: number): Promise<any>;
    getBySlug(slug: string): Promise<any>;
    availability(id: string, startDate: string, endDate: string): Promise<any>;
    create(data: Prisma.SafariCreateInput): Promise<any>;
    update(id: string, data: Prisma.SafariUpdateInput): Promise<any>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    toggleFeatured(id: string, data: {
        isFeatured: boolean;
    }): Promise<any>;
    toggleActive(id: string, data: {
        isActive: boolean;
    }): Promise<any>;
    addDate(id: string, data: Prisma.SafariDateCreateInput): Promise<any>;
    updateDate(dateId: string, data: Prisma.SafariDateUpdateInput): Promise<any>;
    deleteDate(dateId: string): Promise<{
        success: boolean;
    }>;
}
