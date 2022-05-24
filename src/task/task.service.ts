import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(authorId: string, dto: CreateTaskDto): Promise<string> {
    const id = `${Math.random() * 100_000}`;
    await this.prisma.task.create({
      data: {
        id,
        authorId,
        title: dto.title,
        isComplete: false,
      },
    });
    return id;
  }

  async get(taskId: string): Promise<TaskDto | null> {
    return this.prisma.task.findUnique({
      where: { id: taskId },
    });
  }

  async getByAuthor(authorId: string): Promise<TaskDto[]> {
    return this.prisma.task.findMany({
      where: { authorId },
    });
  }

  async complete(taskId: string): Promise<TaskDto | null> {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        isComplete: true,
      },
    });
  }

  async delete(taskId: string): Promise<boolean> {
    const task = await this.prisma.task.delete({
      where: { id: taskId },
    });
    const isDeleted = !!task;
    return isDeleted;
  }
}
