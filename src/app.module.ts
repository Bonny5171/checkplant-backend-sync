import { Module } from '@nestjs/common';
import { SyncModule } from './sync/sync.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), SyncModule, PrismaModule, MailModule],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class AppModule {}
