import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UnilinksService } from './unilinks.service';
import { IUnilinks } from 'src/user/interface/unilinks.interface';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('unilinks')
export class UnilinksController {
  constructor(private readonly unilinks: UnilinksService) {}

  @Get()
  async getAllUnilinks() {
    return this.unilinks.getAllUnilinks();
  }

  @Get(':username/get-by-username')
  async getUnilinksByUsername(@Param('username') username: string) {
    return await this.unilinks.getUniLinksByUsername(username);
  }

  @UseGuards(AuthGuard)
  @Get(':id/get-links-by-id')
  async getUnlinkById(@Param('id') id: string) {
    return await this.unilinks.getUnlinkById(id);
  }

  @UseGuards(AuthGuard)
  @Get(':userId/get-links-by-userId')
  async getUnlinksByUserId(@Param('userId') userId: string) {
    return await this.unilinks.getAllUnlinksByUserId(userId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createuniLink(@Body() body: IUnilinks) {
    return await this.unilinks.createUnilinks(body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id/delete-link')
  async deleteUnlink(@Param('id') id: string) {
    return await this.unilinks.deleteUnilink(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id/update-link')
  async updateUnlink(@Param('id') id: string, @Body() body: any) {
    return await this.unilinks.updateUnilinks(id, body);
  }
}
