//Root module that connects controllers, services and feature modules.

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ResetController } from './reset.controller';
import { SongsModule } from './songs/songs.module';
@Module({
  imports: [SongsModule],
  controllers: [AppController, ResetController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
