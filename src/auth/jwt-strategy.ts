import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.access_token,
      secretOrKey: config.get<string>('JWT_SECRET'), // same as in AuthModule
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub };
  }
}
