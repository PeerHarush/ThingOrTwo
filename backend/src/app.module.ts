import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SongsModule } from './songs/songs.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SongsModule],
  providers: [PrismaService],
})
export class AppModule {}
