import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async createUser(@Body() data: CreateUserDto) {
    return await this.userService.createUser(data);
  }

  @Post(':id/upload-profile')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const fileUrl = await this.userService.uploadProfilePicture(file, id);
    return {
      success: true,
      id,
      fileUrl,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllUser() {
    return this.userService.getUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getSingleUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Put(':userId/:friendId/un-follow')
  async unfollowUser(@Param() param: any) {
    return this.userService.unfollowUser(param);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser({ id: id, body });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser({ id: id });
  }
}
