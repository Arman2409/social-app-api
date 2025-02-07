import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { User } from '@prisma/client';

import { Authorization } from '../../tools/auth.guard';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
    constructor(
        private friendsService: FriendsService
    ) { }

    @Get("add")
    async addFriend(
        @Res() res: Response,
        @Authorization() user: User,
        @Query("userId") userId: string
    ) {
        return await this.friendsService.addFriend(res, user, userId);
    }

    @Get("requests")
    async getFriendRequests(
        @Res() res: Response,
        @Authorization() user: User,
    ) {
        console.log("here");

        return await this.friendsService.getFriendRequests(res, user);
    }

    @Get("accept")
    async acceptRequest(
        @Res() res: Response,
        @Authorization() user: User,
        @Query("userId") userId: string
    ) {
        return await this.friendsService.acceptRequest(res, user, userId);
    }

    @Get("")
    async getFriends(
        @Res() res: Response,
        @Authorization() user: User,
    ) {
        return await this.friendsService.getFriends(res, user);
    }
}
