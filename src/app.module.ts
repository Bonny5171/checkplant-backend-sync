import { Module } from '@nestjs/common';
import { SyncModule } from './sync/sync.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [SyncModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
