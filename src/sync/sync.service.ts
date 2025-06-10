import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncService {
  constructor(private prisma: PrismaService) {}

  async handlePush(payload: { notes: any[] }) {
    const notes = payload.notes || [];

    if (!Array.isArray(notes)) {
      throw new BadRequestException('notes deve ser um array');
    }

    await Promise.all(
      notes.map(async (note) => {
        if (!note.updatedAt || isNaN(Date.parse(note.updatedAt))) {
          throw new BadRequestException('Cada nota deve ter um updatedAt válido');
        }

        if (note.id) {
          const existing = await this.prisma.notes.findUnique({ where: { id: note.id } });

          if (!existing || new Date(note.updatedAt) > existing.updatedAt) {
            await this.prisma.notes.upsert({
              where: { id: note.id },
              update: {
                note: note.note,
                latitude: note.latitude,
                longitude: note.longitude,
                // updatedAt é gerenciado automaticamente pelo Prisma
              },
              create: {
                id: note.id,
                note: note.note,
                latitude: note.latitude,
                longitude: note.longitude,
                createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
                // updatedAt não precisa ser enviado manualmente
              },
            });
          }
        } else {
          await this.prisma.notes.create({
            data: {
              note: note.note,
              latitude: note.latitude,
              longitude: note.longitude,
              createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
              // updatedAt é automático
            },
          });
        }
      }),
    );

    return { status: 'ok', processed: notes.length };
  }

  async handlePull(lastPulledAt?: string | number) {
    let where = {};

    if (lastPulledAt) {
      // Garante que o valor esteja no formato numérico
      const timestamp = Number(lastPulledAt);
      if (isNaN(timestamp)) {
        throw new BadRequestException('lastPulledAt inválido');
      }

      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('lastPulledAt inválido');
      }

      where = {
        updatedAt: { gt: date },
      };
    }

    const updatedNotes = await this.prisma.notes.findMany({
      where,
      orderBy: { updatedAt: 'asc' },
      take: 1000,
    });

    return { notes: updatedNotes };
  }
}
