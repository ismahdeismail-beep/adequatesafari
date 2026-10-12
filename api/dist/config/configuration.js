"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const config_1 = require("@nestjs/config");
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(4000),
    DATABASE_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(64),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('30d'),
    STRIPE_SECRET_KEY: zod_1.z.string().startsWith('sk_').optional(),
    STRIPE_PUBLISHABLE_KEY: zod_1.z.string().startsWith('pk_').optional(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().startsWith('whsec_').optional(),
    STRIPE_API_VERSION: zod_1.z.string().default('2024-06-20'),
    MPESA_CONSUMER_KEY: zod_1.z.string().optional(),
    MPESA_CONSUMER_SECRET: zod_1.z.string().optional(),
    MPESA_PASSKEY: zod_1.z.string().optional(),
    MPESA_SHORTCODE: zod_1.z.string().optional(),
    MPESA_ENVIRONMENT: zod_1.z.enum(['sandbox', 'production']).default('sandbox'),
    MPESA_CALLBACK_URL: zod_1.z.string().url().optional(),
    MPESA_TIMEOUT_URL: zod_1.z.string().url().optional(),
    JOOMLA_API_URL: zod_1.z.string().url().default('http://joomla:80'),
    JOOMLA_API_TOKEN: zod_1.z.string().optional(),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.coerce.number().default(587),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().email().optional(),
    EMAIL_FROM_NAME: zod_1.z.string().default('Absolute Adventure Safaris'),
    AWS_ACCESS_KEY_ID: zod_1.z.string().optional(),
    AWS_SECRET_ACCESS_KEY: zod_1.z.string().optional(),
    AWS_REGION: zod_1.z.string().default('eu-west-1'),
    AWS_S3_BUCKET: zod_1.z.string().optional(),
    AWS_CLOUDFRONT_DOMAIN: zod_1.z.string().optional(),
    NEXT_PUBLIC_JOOMLA_URL: zod_1.z.string().url().default('https://www.absoluteadventuresafaris.com'),
    NEXT_PUBLIC_API_URL: zod_1.z.string().url().default('https://api.absoluteadventuresafaris.com'),
    NEXT_PUBLIC_BOOKING_URL: zod_1.z.string().url().default('https://book.absoluteadventuresafaris.com'),
    NEXT_PUBLIC_ITINERARY_URL: zod_1.z.string().url().default('https://plan.absoluteadventuresafaris.com'),
    NEXT_PUBLIC_AGENT_URL: zod_1.z.string().url().default('https://agents.absoluteadventuresafaris.com'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003'),
    THROTTLE_LIMIT: zod_1.z.coerce.number().default(100),
    GA_MEASUREMENT_ID: zod_1.z.string().optional(),
    GTM_CONTAINER_ID: zod_1.z.string().optional(),
    FACEBOOK_PIXEL_ID: zod_1.z.string().optional(),
});
function validate(config) {
    const result = envSchema.safeParse(config);
    if (!result.success) {
        throw new Error(`Config validation failed: ${result.error.message}`);
    }
    return result.data;
}
exports.default = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    databaseUrl: process.env.DATABASE_URL,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        apiVersion: process.env.STRIPE_API_VERSION || '2024-06-20',
    },
    mpesa: {
        consumerKey: process.env.MPESA_CONSUMER_KEY,
        consumerSecret: process.env.MPESA_CONSUMER_SECRET,
        passkey: process.env.MPESA_PASSKEY,
        shortcode: process.env.MPESA_SHORTCODE,
        environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
        callbackUrl: process.env.MPESA_CALLBACK_URL,
        timeoutUrl: process.env.MPESA_TIMEOUT_URL,
    },
    joomla: {
        apiUrl: process.env.JOOMLA_API_URL || 'http://joomla:80',
        apiToken: process.env.JOOMLA_API_TOKEN,
    },
    email: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.EMAIL_FROM,
        fromName: process.env.EMAIL_FROM_NAME || 'Absolute Adventure Safaris',
    },
    storage: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'eu-west-1',
        bucket: process.env.AWS_S3_BUCKET,
        cloudfrontDomain: process.env.AWS_CLOUDFRONT_DOMAIN,
    },
    frontend: {
        joomlaUrl: process.env.NEXT_PUBLIC_JOOMLA_URL,
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL,
        itineraryUrl: process.env.NEXT_PUBLIC_ITINERARY_URL,
        agentUrl: process.env.NEXT_PUBLIC_AGENT_URL,
    },
    corsOrigin: process.env.CORS_ORIGIN?.split(',') || [],
    throttleLimit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
}));
//# sourceMappingURL=configuration.js.map