import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserItemDto } from './dto/user.dto';
import { BaseQueryDto } from '../common/validator/base.query.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';
import { PATH_TO_IMAGE } from '../common/utils/upload.utils';
import * as fs from 'node:fs';
import { SocketGateway } from '../socket/socket.gatewy';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly socket: SocketGateway,
  ) {}
  private usersList = [];
  async create(createUserDto: CreateUserDto) {
    const index = new Date().valueOf();
    this.usersList.push({
      ...createUserDto,
      id: index,
    });
    return this.usersList[0];
  }

  async findAll(query?: BaseQueryDto, user?: any): Promise<any> {
    const options = {
      page: +query?.page || 1,
      limit: +query?.limit || 10,
    };
    // const queryBuilder = await this.userRepository
    //     .createQueryBuilder('user')
    //     .leftJoinAndSelect('user.posts', 'post')
    //     .where('"isActive" = false')
    //     .skip((options.page - 1) * options.limit)
    //     .take(options.limit);
    //
    // const count =  await queryBuilder.getCount();

    // const select = 'email, "firstName", age, id, "createdAt"';

    // queryBuilder
    //   .select('email, "firstName", age, id, "createdAt"')
    //   .where({ isActive: false });
    //
    // if (query.search) {
    //   queryBuilder.andWhere(`LOWER("firstName") LIKE '%${query.search}%'`);
    // }
    //
    // const [pagination, rawEntities] = await paginateRawAndEntities(
    //   queryBuilder,
    //   options,
    // );
    //
    // return {
    //   page: pagination.meta.currentPage,
    //   pages: pagination.meta.totalPages,
    //   countItems: pagination.meta.totalItems,
    //   entities: rawEntities as [UserItemDto],
    // };

    const [entities, total] = await this.userRepository.findAndCount({
      where: { isActive: false },
      select: {
        email: true,
        firstName: true,
        id: true,
      },
      relations: {
        posts: true,
      },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });

    return {
      page: options.page,
      pages: Math.ceil(total / options.limit),
      countItems: total,
      entities: entities,
    };
  }

  findOne(id: number, fileName?: any) {
    if (fileName) {
      const avatarPath = `${PATH_TO_IMAGE}/${fileName}`;
      console.log(avatarPath); /// { avatar: avatarPath }
    }

    return this.usersList.find((user) => user.id == id);
  }
  async updateOne(id: number, body?: any, user?: any) {
    //try {
    //       fs.unlinkSync(`./upload/1286888386033841.png`);
    //     } catch (err) {
    //       console.log(err);
    //     }

    if (user) {
      await this.socket.sendMessage(user.id, 'new-massage', {
        message: 'Hello!',
        date: '',
      });
    }

    //return this.usersList.find((user) => user.id == id);
    return true;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
