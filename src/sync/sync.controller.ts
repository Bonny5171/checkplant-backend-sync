import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('push')
  async pushData(@Body() payload: any) {
    return this.syncService.handlePush(payload);
  }

  @Get('pull')
  async pullData(@Query('lastPulledAt') lastPulledAt?: string) {
    return this.syncService.handlePull(lastPulledAt);
  }
}
