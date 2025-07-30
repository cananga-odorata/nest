// src/core/config/config.schema.ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION_TIME: Joi.string().optional(),
    ENCRYPTION_KEY: Joi.string().optional(),
    ENCRYPTION_IV: Joi.string().optional(),
});