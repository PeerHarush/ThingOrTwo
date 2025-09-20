// Provides a shared Prisma client and handles DB connect/disconnect.

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // connect to DB when module starts
  }

  async onModuleDestroy() {
    await this.$disconnect(); // disconnect cleanly when app shuts down
  }
}
