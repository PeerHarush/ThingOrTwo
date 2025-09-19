import { Controller, Post } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class ResetController {
  constructor(private prisma: PrismaService) {}

  @Post('reset')
  async reset() {
    await this.prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "Song" RESTART IDENTITY CASCADE;`,
    );
    return { ok: true };
  }
}
