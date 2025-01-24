import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto} from './dto/user.dto';
import { BaseQueryDto } from '../common/validator/base.query.validator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';

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

  findAll(data: BaseQueryDto) {
    return this.usersList;
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
