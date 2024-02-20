import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/schema/message.schema';
import { User } from 'src/schema/user.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private readonly model: Model<Message>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserMessages(userId: string) {
    const user = await this.userModel.findOne({ _id: userId });
    const friends = await this.userModel.find({
      _id: { $in: user.messageIds.map((item) => item.userId) },
    });
    const filteredMessageIds = friends.map((friend) =>
      friend.messageIds.find((item) => item.userId == userId),
    );

    return {
      friends,
      filteredMessageIds,
    };
  }

  async getUserByRoomId(roomId: string, userId: string) {
    const messages = await this.model.findOne({
      messageId: roomId,
    });
    return messages;
  }
  async joinRoom(client, roomId) {
    console.log(client, roomId);
  }
}
