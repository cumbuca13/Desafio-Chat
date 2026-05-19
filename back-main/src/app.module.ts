import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './AuthController';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [TasksModule, UsersModule],
  controllers: [AppController, AuthController],
  providers: [AppService, ChatGateway, PrismaService],
})
export class AppModule {}