//Handles all routes under /songs:

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

@Controller('songs') // Songs API endpoints
export class SongsController {
  constructor(private readonly songs: SongsService) {}

  @Get() // Return list of songs
  async list() {
    return this.songs.list();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // form-data and attach file to request
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('CSV file is required');
    const { inserted } = await this.songs.importFromCsv(file);
    return { ok: true, inserted };
  }
}
