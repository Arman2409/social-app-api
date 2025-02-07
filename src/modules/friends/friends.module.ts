import { Module } from '@nestjs/common';

import { LoggerService } from '../../tools/logger.service';
import { PrismaService } from '../../tools/database.service';

import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, PrismaService, LoggerService]
})
export class FriendsModule {}
