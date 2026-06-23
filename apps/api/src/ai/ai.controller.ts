import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-bio')
  async generateBio(@Body() profileData: any) {
    return this.aiService.generateBio(profileData);
  }
}
