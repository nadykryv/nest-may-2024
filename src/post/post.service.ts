import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../database/entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  private logger: Logger;
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async create(data: CreatePostDto) {
    try {
      const post = await this.postRepository.save(
        this.postRepository.create({
          ...data,
          user_id: '5392a171-0e96-4308-8046-b8f2078a93b5',
        }),
      );
      return post;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Creat post failed.');
    }
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
