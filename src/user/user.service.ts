import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { IUser } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly model: Model<IUser>) {}
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

  async getUser(id: string) {
    const user = await this.model.findOne({ _id: id });
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    return user;
  }

  async getUsers() {
    return await this.model.find();
  }

  async updateUser(props: { id: string; body: UpdateUserDto }) {
    const user = await this.model.findOne({ _id: props.id });
    if (!user) {
      throw new UnprocessableEntityException(`User Not Found`);
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
