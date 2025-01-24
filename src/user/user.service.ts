import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { BaseQueryDto } from '../common/validator/base.query.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async findAll(query?: BaseQueryDto) {
    const options = {
      page: query?.page || 1,
      limit: query?.limit || 10,
    };
    const queryBuilder = await this.userRepository.createQueryBuilder('user');
    queryBuilder
      .select('email, "firstName", age, id, "createdAt')
      .where({ isActive: true });
    if (query.search) {
      queryBuilder.andWhere(`LOWER("firstName) LIKE '${query.search}'`);
    }

    const [pagination, rawEntities] = await paginateRawAndEntities(
      queryBuilder,
      options,
    );

    return {
      page: pagination.meta.currentPage,
      pages: pagination.meta.totalPages,
      countItems: pagination.meta.totalItems,
      entities: rawEntities,
    };
  }

  findOne(id: number) {
    return this.usersList.find((user) => user.id === id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
