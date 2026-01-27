import 'dotenv/config';
import * as joi from 'joi';

interface EnvironmentVariables {
    PORT: number;
    FRONTEND_URL: string;
    DATABASE_URL: string;
}

const environmentSchema = joi.object({
    PORT: joi.number().required(),
    FRONTEND_URL: joi.string().required(),
    DATABASE_URL: joi.string().required(),
}).unknown();

const { error, value } = environmentSchema.validate({
    ...process.env
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const env: EnvironmentVariables = value;

export const environmentVariables = {
    PORT: env.PORT,
    FRONTEND_URL: env.FRONTEND_URL,
    DATABASE_URL: env.DATABASE_URL,
};