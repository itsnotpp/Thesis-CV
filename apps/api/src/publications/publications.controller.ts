import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post(':userId')
  create(@Param('userId') userId: string, @Body() createPublicationDto: any) {
    return this.publicationsService.create(userId, createPublicationDto);
  }

  @Get()
  findAll() {
    return this.publicationsService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.publicationsService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicationDto: any) {
    return this.publicationsService.update(id, updatePublicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicationsService.remove(id);
  }
}
