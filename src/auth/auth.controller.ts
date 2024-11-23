import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { OAuth2Client } from 'google-auth-library';
import { CreateUserDto } from 'src/user/dtos/user.dto';

@Controller('auth')
export class AuthController {
  private client: OAuth2Client;
  constructor(private readonly authService: AuthService) {
    this.client = new OAuth2Client();
  }

  @Post('/login')
  async loginUser(@Body() body: LoginDto) {
    return this.authService.signIn(body);
  }

  @Post('/registration')
  async registerUser(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('/google-auth')
  async googleAuth(@Body() body: any) {
    const { credential, clientId } = body;
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      const userDetails = await this.authService.handleGoogleSignIn(payload);
      return userDetails;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
