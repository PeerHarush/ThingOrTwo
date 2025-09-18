import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songs: SongsService) {}

  @Get()
  async list() {
    // מחזיר ממויין לפי שם הלהקה
    return this.songs.list();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('CSV file is required');
    const { inserted } = await this.songs.importFromCsv(file);
    return { ok: true, inserted };
  }
}
