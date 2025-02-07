import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../tools/database.service';
import { LoggerService } from '../../tools/logger.service';

@Module({
  providers: [UsersService, JwtService, PrismaService, LoggerService],
  controllers: [UsersController],
})
export class UsersModule {}
