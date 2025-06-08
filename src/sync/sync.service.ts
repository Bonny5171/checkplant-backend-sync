import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncService {
  constructor(private prisma: PrismaService) {}

  async handlePush(payload: { plants: any[] }) {
    const plants = payload.plants || [];

    if (!Array.isArray(plants)) {
      throw new BadRequestException('plants deve ser um array');
    }

    // Processar em paralelo para maior performance
    await Promise.all(
      plants.map(async (plant) => {
        // Validação básica updatedAt
        if (!plant.updatedAt || isNaN(Date.parse(plant.updatedAt))) {
          throw new BadRequestException('Cada planta deve ter updatedAt válido');
        }

        if (plant.id) {
          const existing = await this.prisma.plant.findUnique({ where: { id: plant.id } });

          if (!existing || new Date(plant.updatedAt) > existing.updatedAt) {
            await this.prisma.plant.upsert({
              where: { id: plant.id },
              update: {
                name: plant.name,
                updatedAt: new Date(plant.updatedAt),
                // outros campos se tiver
              },
              create: {
                id: plant.id,
                name: plant.name,
                updatedAt: new Date(plant.updatedAt),
                createdAt: plant.createdAt ? new Date(plant.createdAt) : new Date(),
                // outros campos se tiver
              },
            });
          }
        } else {
          // Sem id, cria nova planta
          await this.prisma.plant.create({
            data: {
              name: plant.name,
              updatedAt: new Date(plant.updatedAt),
              createdAt: plant.createdAt ? new Date(plant.createdAt) : new Date(),
              // outros campos se tiver
            },
          });
        }
      }),
    );

    return { status: 'ok', processed: plants.length };
  }

  async handlePull(lastPulledAt?: string) {
    let where = {};

    if (lastPulledAt) {
      const date = new Date(lastPulledAt);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('lastPulledAt inválido');
      }
      where = { updatedAt: { gt: date } };
    }

    // opcional: limite de registros para não sobrecarregar resposta
    const updatedPlants = await this.prisma.plant.findMany({
      where,
      orderBy: { updatedAt: 'asc' },
      take: 1000, // limite arbitrário
    });

    return { plants: updatedPlants };
  }
}
