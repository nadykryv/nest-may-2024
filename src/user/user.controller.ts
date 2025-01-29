import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, AccountResponseDto, UserItemDto } from './dto/user.dto';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseQueryDto } from '../common/validator/base.query.validator';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../common/interface/response.interface';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorator/roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, PATH_TO_IMAGE } from '../common/utils/upload.utils';

@UseGuards(AuthGuard())
@ApiTags('User')
@ApiExtraModels(UserItemDto, PaginatedDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: HttpStatus.CREATED, type: AccountResponseDto })
  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles('Admin', 'Manager')
  @UseGuards(AuthGuard(), RoleGuard)
  @ApiPaginatedResponse('entities', UserItemDto)
  @Get('/list')
  findAll(@Query() query: BaseQueryDto) {
    return this.userService.findAll(query);
  }

  @Roles('Admin')
  @UseGuards(AuthGuard(), RoleGuard)
  @Patch('/roles/:id')
  update(@Param('id') id: string) {
    return this.userService.update(+id);
  }

  @Patch('avatar')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: `.${PATH_TO_IMAGE}`,
        filename: editFileName,
      }),
    }),
  )
  updateAvatar(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000000 }), // bytes
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.findOne(Number(id), file.filename);
  }

  @Patch('gallery')
  uploadImages(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  //@Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.userService.findOne(Number(id));
  //   }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
