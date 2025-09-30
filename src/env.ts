import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  GOOGLE_CALLBACK_URL: z
    .string()
    .url()
    .default("http://localhost:8080/auth/google/redirect"),
});

export const env = envSchema.parse(process.env);
