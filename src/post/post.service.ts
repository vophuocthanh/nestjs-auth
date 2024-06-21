import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import {
  CreatePostDto,
  PostFilterType,
  PostPaginationResponseType,
  UpdatePostDto,
} from 'src/post/dto/post.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreatePostDto): Promise<Post> {
    return await this.prismaService.post.create({ data });
  }

  async getAll(filters: PostFilterType): Promise<PostPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;

    const posts = await this.prismaService.post.findMany({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            summary: {
              contains: search,
            },
          },
          {
            content: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            status: 1,
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const total = await this.prismaService.post.count({
      where: {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            summary: {
              contains: search,
            },
          },
          {
            content: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            status: 2,
          },
        ],
      },
    });

    return {
      data: posts,
      total,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetail(id: number): Promise<Post> {
    return await this.prismaService.post.findFirst({
      where: {
        id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdatePostDto): Promise<Post> {
    return this.prismaService.post.update({
      where: {
        id,
      },
      data,
    });
  }
}
