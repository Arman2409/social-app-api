import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersController } from './modules/users/users.controller';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './tools/database.service';
import { LoggerService } from './tools/logger.service';
import { FriendsModule } from './modules/friends/friends.module';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AuthModule, UsersModule, FriendsModule],
  controllers: [AppController, UsersController],
  providers: [JwtService, UsersService, PrismaService, LoggerService]
})
export class AppModule {}
