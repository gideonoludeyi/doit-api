import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcryptjs';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(email: string, password: string) {
    const account = await this.prisma.account.findUnique({
      where: { email },
    });

    if (!account) throw new Error('Email already registered');

    const id = nanoid();
    const hashedPassword = hashSync(password);

    return await this.prisma.account.create({
      data: {
        id,
        email,
        password: hashedPassword,
      },
    });
  }

  async login(email: string, password: string) {
    const account = await this.prisma.account.findUnique({
      where: { email },
    });

    if (!account) throw new Error('Account not found');

    const isCorrectPassword = compareSync(password, account.password);
    if (!isCorrectPassword) throw new Error('Incorrect password');

    return account;
  }
}
