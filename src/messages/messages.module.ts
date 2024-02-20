import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/schema/message.schema';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [MessagesGateway, MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
