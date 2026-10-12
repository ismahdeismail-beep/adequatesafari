import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Country, SafariStyle, AccommodationType } from '@prisma/client';
interface SafariFilters {
    country?: Country;
    safariStyle?: SafariStyle;
    accommodationType?: AccommodationType;
    minPrice?: number;
    maxPrice?: number;
    durationDays?: number;
    isFeatured?: boolean;
    search?: string;
    availableFrom?: Date;
    availableTo?: Date;
}
export declare class SafarisService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SafariCreateInput): Promise<any>;
    findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.SafariWhereInput;
        orderBy?: Prisma.SafariOrderByWithRelationInput;
        filters?: SafariFilters;
    }): Promise<{
        data: any;
        total: any;
    }>;
    findBySlug(slug: string): Promise<any>;
    findById(id: string): Promise<any>;
    findFeatured(limit?: number): Promise<any>;
    findByCountry(country: Country, limit?: number): Promise<any>;
    update(id: string, data: Prisma.SafariUpdateInput): Promise<any>;
    delete(id: string): Promise<any>;
    toggleFeatured(id: string, isFeatured: boolean): Promise<any>;
    toggleActive(id: string, isActive: boolean): Promise<any>;
    addDate(safariId: string, data: Prisma.SafariDateCreateInput): Promise<any>;
    updateDate(dateId: string, data: Prisma.SafariDateUpdateInput): Promise<any>;
    deleteDate(dateId: string): Promise<any>;
    getAvailability(safariId: string, startDate: Date, endDate: Date): Promise<any>;
    private buildWhere;
    private generateSlug;
}
export {};
