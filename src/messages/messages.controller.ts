import { Controller, Get, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('user-messages')
export class MessagesController {
  constructor(private readonly service: MessagesService) {}
  @Get(':id')
  getAllMessages(@Param('id') id: string) {
    return this.service.getUserMessages(id);
  }

  @Get(':roomId/:userId')
  getUserMessages(@Param() param: any) {
    return this.service.getUserByRoomId(param.roomId, param.userId);
  }
}
