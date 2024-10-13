import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { IUser } from './interface/user.interface';
import { Post } from 'src/schema/post.schema';
import * as admin from 'firebase-admin';
import { Message, Messages } from 'src/schema/message.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<IUser>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(Messages.name) private readonly messagesModel: Model<Messages>,
  ) {}
  async createUser(data: CreateUserDto) {
    const existingUser = await this.model.findOne({
      username: data.username,
      email: data.email,
    });
    if (existingUser) {
      throw new UnprocessableEntityException('user already exists');
    }
    return await this.model.create(data);
  }

  async getUserByUsername(username: string) {
    const user = await this.model.findOne({ username: username });
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    return user;
  }

  async checkUsername(username: string) {
    const user = await this.model.findOne({ username: username });
    if (!user) {
      return {
        success: 'true',
        msg: 'username available',
      };
    }
    return {
      success: 'false',
      msg: 'username not available',
    };
  }

  async getUser(id: string) {
    const user = await this.model.findOne({ _id: id });
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    const postsCount = await this.postModel
      .find({ createdById: user._id })
      .count();

    const data = {
      user,
      postsCount: postsCount,
    };

    return data;
  }

  async checkUserMessageId({ userId, friendId }): Promise<any> {
    const user = await this.model.findOne({ _id: userId });
    const friend = await this.model.findOne({ _id: friendId });

    if (
      user?.messageIds.find((msg) => msg.userId == friendId) &&
      friend.messageIds.find((msg) => msg.userId == userId)
    ) {
      const messageId = user.messageIds.find((msg) => msg.userId == friendId);
      return messageId;
    } else {
      const messageBody = {
        userId: friendId,
        messageId: Math.floor(Math.random() * 10000),
      };
      const friendBody = {
        userId: userId,
        messageId: messageBody.messageId,
      };
      user.messageIds.push(messageBody);
      friend.messageIds.push(friendBody);
      await user.save();
      await friend.save();

      const msgs = await this.messageModel.create({
        messageId: messageBody.messageId,
        messages: [],
      });

      return msgs;
    }
  }

  async uploadProfilePicture(file, id) {
    const bucket = admin.storage().bucket();
    const destination = `profiles/${id}/${file.originalname}`;

    const fileUpload = bucket.file(destination);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise<string>((resolve, reject) => {
      stream.on('error', (err) => {
        console.error('Error uploading to Firebase Storage:', err);
        reject('Error uploading to Firebase Storage');
      });

      stream.on('finish', async () => {
        // Generate a signed URL for the file
        const [url] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '01-01-3000', // Adjust the expiration date as needed
        });

        console.log('Upload to Firebase Storage successful');
        resolve(url);
      });

      // Write the buffer to the stream
      stream.end(file.buffer);
    });
  }

  async getUsers(param, query) {
    const users = await this.model.find({
      _id: { $ne: param.id },
      username: { $regex: query.search, $options: 'i' },
    });
    const data = await Promise.all(
      users.map(async (user) => {
        const postsCount = await this.postModel
          .find({ createdById: user._id })
          .count();

        return {
          user,
          postsCount: postsCount,
        };
      }),
    );
    return data;
  }

  async unfollowUser(data) {
    await this.model.findByIdAndUpdate(
      { _id: data.userId },
      { $pull: { following: data.friendId } },
    );

    await this.model.findByIdAndUpdate(
      { _id: data.friendId },
      { $pull: { followers: data.userId } },
    );

    return {
      success: true,
      msg: 'User unfollowed',
    };
  }

  async updateUser(props: { id: string; body: UpdateUserDto }) {
    const user = await this.model.findOne({ _id: props.id });
    if (!user) {
      throw new UnprocessableEntityException(`User Not Found`);
    }

    if (props.body.following) {
      await this.model.findByIdAndUpdate(
        { _id: props.body.following[0] },
        { $push: { followers: user._id } },
      );
    }

    await this.model.findByIdAndUpdate(props.id, props.body, { new: true });

    return {
      msg: 'User updated successfully',
    };
  }

  async deleteUser({ id }) {
    const user = await this.model.findOne({ _id: id });
    if (!user) {
      throw new UnprocessableEntityException(`User Not Found`);
    }

    await this.model.findByIdAndDelete(id);

    return {
      msg: 'User deleted',
    };
  }
}
