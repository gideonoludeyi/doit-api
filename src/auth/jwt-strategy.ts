import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.access_token,
      secretOrKey: 'secret', // same as in AuthModule
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub };
  }
}
