import { Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcryptjs';
import { nanoid } from 'nanoid';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  /**
   * Regex obtained from {@link https://stackoverflow.com/a/201378 StackOverflow}
   */
  private emailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  constructor(private prisma: PrismaService) {}

  async signUp(email: string, password: string) {
    const isValidEmail = this.emailRegex.test(email);
    if (!isValidEmail) throw new Error('Invalid email');

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
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async login(email: string, password: string) {
    const isValidEmail = this.emailRegex.test(email);
    if (!isValidEmail) throw new Error('Invalid email');

    const account = await this.prisma.account.findUnique({
      where: { email },
    });

    if (!account) throw new Error('Account not found');

    const isCorrectPassword = compareSync(password, account.password);
    if (!isCorrectPassword) throw new Error('Incorrect password');

    return {
      id: account.id,
      email: account.email,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}
