import { Module } from '@nestjs/common';

import { LoggerService } from '../../tools/services/logger.service';
import { PrismaService } from '../../tools/services/database.service';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, PrismaService, LoggerService],
})
export class FriendsModule {}
