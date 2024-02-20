import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';
import { Post, PostSchema } from 'src/schema/post.schema';
import {
  Message,
  MessageSchema,
  Messages,
  MessagesSchema,
} from 'src/schema/message.schema';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Messages.name, schema: MessagesSchema },
    ]),
  ],
})
export class UserModule {}
