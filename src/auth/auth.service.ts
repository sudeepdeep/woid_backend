import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/user/interface/user.interface';
import { User } from 'src/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dtos/user.dto';

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

  async signUp(body: CreateUserDto) {
    const { username, email } = body;
    let user = await this.model.findOne({ username: username, email: email });
    if (user) {
      throw new UnprocessableEntityException(
        'User with the given username/email already exists',
      );
    }

    //create user
    user = await this.model.create(body);
    const payload = { sub: user._id, username: username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId: user._id,
    };
  }

  async handleGoogleSignIn(payload: any) {
    const email = payload.email;
    const user = await this.model.findOne({ email: email });

    if (!user) {
      //create an user
      const data = {
        email: email,
        username: email.split('@')[0],
        authSource: 'google',
      };
      try {
        const userCreated = await this.model.create(data);
        const tokenData = {
          sub: userCreated._id,
          username: userCreated.username,
        };

        return {
          access_token: await this.jwtService.signAsync(tokenData),
          userId: userCreated._id,
        };
      } catch (err) {
        console.log(err);
      }
    } else {
      //login user
      const tokenData = { sub: user._id, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(tokenData),
        userId: user._id,
      };
    }
  }
}
