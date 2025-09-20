//Fetches songs from DB and imports new ones from CSV files.

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { parse } from 'csv-parse/sync';

type CsvRow = { ['Song Name']?: string; Band?: string; Year?: string | number };

@Injectable()
export class SongsService {
  constructor(private prisma: PrismaService) {}

  // Return songs ordered by band (minimal fields only)

  async list() {
    return this.prisma.song.findMany({
      orderBy: { band: 'asc' },
      select: {
        id: true,
        title: true,
        band: true,
        year: true,
        createdAt: true,
      },
    });
  }

  //Accepts a semicolon-delimited CSV, lowercases fields, and saves to DB.

  async importFromCsv(file: Express.Multer.File) {
    try {
      const text = file.buffer.toString('utf8');
      const rows = parse(text, {
        columns: true, // map each row to an object using header names
        delimiter: ';',
        skip_empty_lines: true,
        trim: true,
      });

      // Normalize: to lowercase; coerce Year to number or null

      const data = (rows as CsvRow[]).map((r) => ({
        title: (r['Song Name'] ?? '').toString().toLowerCase(),
        band: (r.Band ?? '').toString().toLowerCase(),
        year: r.Year !== undefined && r.Year !== '' ? Number(r.Year) : null,
      }));

      //Drop empty rows
      const cleaned = data.filter((d) => d.title && d.band);

      const res = await this.prisma.song.createMany({
        data: cleaned,
        skipDuplicates: true,
      });

      return { inserted: res.count };
    } catch {
      throw new InternalServerErrorException('Failed to import CSV');
    }
  }
}
