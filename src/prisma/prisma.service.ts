import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {PrismaClient} from "../../generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";
import {environmentVariables} from "../config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy
{
    constructor()
    {
        const connectionString = `${environmentVariables.DATABASE_URL}`

        const adapter = new PrismaPg({connectionString});
        super({adapter});
    }

    async onModuleInit()
    {
        await this.$connect();
    }

    async onModuleDestroy()
    {
        await this.$disconnect();
    }
}
