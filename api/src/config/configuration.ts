import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),

  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(64),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
  STRIPE_API_VERSION: z.string().default('2024-06-20'),

  // M-Pesa
  MPESA_CONSUMER_KEY: z.string().optional(),
  MPESA_CONSUMER_SECRET: z.string().optional(),
  MPESA_PASSKEY: z.string().optional(),
  MPESA_SHORTCODE: z.string().optional(),
  MPESA_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),
  MPESA_CALLBACK_URL: z.string().url().optional(),
  MPESA_TIMEOUT_URL: z.string().url().optional(),

  // Joomla
  JOOMLA_API_URL: z.string().url().default('http://joomla:80'),
  JOOMLA_API_TOKEN: z.string().optional(),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_FROM_NAME: z.string().default('Adequate Safaris'),

  // Storage
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('eu-west-1'),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_CLOUDFRONT_DOMAIN: z.string().optional(),

  // Frontend URLs
  NEXT_PUBLIC_JOOMLA_URL: z.string().url().default('https://www.adequatesafaris.com'),
  NEXT_PUBLIC_API_URL: z.string().url().default('https://api.adequatesafaris.com'),
  NEXT_PUBLIC_BOOKING_URL: z.string().url().default('https://book.adequatesafaris.com'),
  NEXT_PUBLIC_ITINERARY_URL: z.string().url().default('https://plan.adequatesafaris.com'),
  NEXT_PUBLIC_AGENT_URL: z.string().url().default('https://agents.adequatesafaris.com'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003'),

  // Throttling
  THROTTLE_LIMIT: z.coerce.number().default(100),

  // Analytics
  GA_MEASUREMENT_ID: z.string().optional(),
  GTM_CONTAINER_ID: z.string().optional(),
  FACEBOOK_PIXEL_ID: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Config validation failed: ${result.error.message}`);
  }
  return result.data;
}

export default registerAs('app', () => ({
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
    fromName: process.env.EMAIL_FROM_NAME || 'Adequate Safaris',
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