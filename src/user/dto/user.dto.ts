import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: false })
  id: number;
  @ApiProperty({ required: false })
  name: string;
  @ApiProperty({
    default: 'lviv',
    required: false,
    description: 'user city',
    example: 'Poltava',
  })
  city: string;
  @ApiProperty({ required: true })
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  age: number;
}

export class AccountResponseDto {
  @ApiProperty({ required: true })
  id: number;
  @ApiProperty({ required: false })
  name: string;
  @ApiProperty({
    default: 'lviv',
    required: false,
    description: 'user city',
    example: 'Poltava',
  })
  city: string;
  @ApiProperty({ required: true })
  email: string;
  @ApiProperty()
  age: number;
  @ApiProperty()
  status: boolean;
}
export class UpdateUserDto {}

export class UserQueryDto {
  @ApiProperty()
  limit: string;
  @ApiProperty()
  sort: string;
  page: string;
}
