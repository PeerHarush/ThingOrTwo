//Provides a POST /reset endpoint to clear the Song table.

import { Controller, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class ResetController {
  constructor(private prisma: PrismaService) {}

  @Post('reset') // truncate table and reset IDs
  async reset() {
    await this.prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "Song" RESTART IDENTITY CASCADE;`,
    );
    return { ok: true };
  }
}
