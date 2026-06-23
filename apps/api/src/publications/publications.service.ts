import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPublicationDto: any) {
    return this.prisma.publication.create({
      data: {
        ...createPublicationDto,
        user: {
          connect: { id: userId }
        }
      },
    });
  }

  async findAll() {
    return this.prisma.publication.findMany();
  }

  async findByUserId(userId: string) {
    return this.prisma.publication.findMany({
      where: { userId },
      orderBy: { publishDate: 'desc' }
    });
  }

  async findOne(id: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
    });
    if (!publication) throw new NotFoundException('Publication not found');
    return publication;
  }

  async update(id: string, updatePublicationDto: any) {
    return this.prisma.publication.update({
      where: { id },
      data: updatePublicationDto,
    });
  }

  async remove(id: string) {
    return this.prisma.publication.delete({
      where: { id },
    });
  }
}
