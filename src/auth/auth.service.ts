import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/user/interface/user.interface';
import { User } from 'src/schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<IUser>,
    private jwtService: JwtService,
  ) {}
  async signIn(body: LoginDto) {
    const { username, password } = body;
    const user = await this.model.findOne({ username: username });
    if (!user) {
      throw new UnprocessableEntityException('No such user found');
    }

    const comparePassword = await bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      throw new UnprocessableEntityException('Incorrect password');
    }

    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user._id,
    };
  }
}
