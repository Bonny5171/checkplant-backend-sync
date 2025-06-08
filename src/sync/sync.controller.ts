import { Body, Controller, Get, Post } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  // ENVIAR dados alterados
  @Post('push')
  async pushData(@Body() payload: any) {
    return this.syncService.handlePush(payload);
  }

  // BUSCAR dados do backend
  @Get('pull')
  async pullData() {
    return this.syncService.handlePull();
  }
}
