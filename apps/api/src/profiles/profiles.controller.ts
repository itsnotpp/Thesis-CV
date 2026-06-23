import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post(':userId')
  create(@Param('userId') userId: string, @Body() createProfileDto: any) {
    return this.profilesService.create(userId, createProfileDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: any) {
    return this.profilesService.update(id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(id);
  }
}
