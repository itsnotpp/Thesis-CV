import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createProfileDto: any) {
    return this.prisma.profile.create({
      data: {
        ...createProfileDto,
        user: {
          connect: { id: userId }
        }
      },
    });
  }

  async findAll() {
    return this.prisma.profile.findMany();
  }

  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        educations: true,
        experiences: true,
      }
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  async update(id: string, updateProfileDto: any) {
    return this.prisma.profile.update({
      where: { id },
      data: updateProfileDto,
    });
  }

  async remove(id: string) {
    return this.prisma.profile.delete({
      where: { id },
    });
  }
}
