import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
import { PublicationsModule } from './publications/publications.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [PrismaModule, ProfilesModule, PublicationsModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
