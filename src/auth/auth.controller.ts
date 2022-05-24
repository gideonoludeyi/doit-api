import {
  BadRequestException,
  Body,
  ConsoleLogger,
  Controller,
  Post,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private logger = new ConsoleLogger(this.constructor.name);

  constructor(private service: AuthService, private jwt: JwtService) {}

  @Post('signup')
  async signUp(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const account = await this.service.signUp(email, password);
      return account;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    let account: any;
    try {
      account = await this.service.login(email, password);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }

    const token = this.jwt.sign({
      sub: account.id,
    });

    return {
      access_token: token,
    };
  }
}
