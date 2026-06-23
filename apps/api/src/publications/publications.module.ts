import { Module } from '@nestjs/common';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PublicationsController],
  providers: [PublicationsService]
})
export class PublicationsModule {}
