import { env } from './env';
import type { CorsOptions } from 'cors';

const allowedOrigins = process.env.NODE_ENV === 'production' ? env.frontend.url : '*';

export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
