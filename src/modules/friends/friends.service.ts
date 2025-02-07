import {
    BadRequestException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import type { Response } from 'express';

import { PrismaService } from '../../tools/database.service';
import { LoggerService } from '../../tools/logger.service';

@Injectable()
export class FriendsService {
    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) { }

    async addFriend(res: Response, user: User, friendId: string) {
        const { id: userId } = { ...user };

        try {
            if (!friendId) {
                throw new BadRequestException('Query userId not provided');
            }

            if (friendId === userId) {
                throw new BadRequestException("Can't send friend request yourself");
            }

            await this.prisma.friendRequest.create({
                data: {
                    fromId: userId,
                    toId: friendId,
                    createdAt: new Date(),
                },
            });

            return res.status(HttpStatus.OK).end();
        } catch (err) {
            this.logger.error(
                `Failed to create friend request, user ID: ${userId}, friend ID:${friendId}, error: ${err}`,
            );

            throw new InternalServerErrorException('Failed to send friend request');
        }
    }

    async getFriendRequests(res: Response, user: User) {
        const { id: userId } = { ...user };

        try {
            const result = await this.prisma.friendRequest.findMany({
                where: {
                    toId: userId,
                },
            });

            return res.status(HttpStatus.OK).send(result);
        } catch (err) {
            this.logger.error(
                `Failed to get friend request, user ID: ${userId}, error: ${err}`,
            );

            throw new InternalServerErrorException('Failed to get friend request');
        }
    }

    async acceptRequest(res: Response, user: User, friendId: string) {
        const { id: userId } = { ...user };

        try {
            if (!userId) {
                throw new BadRequestException('Query userId not provided');
            }

            if (userId === friendId) {
                throw new BadRequestException("Can't accept your own request");
            }

            const { logger, prisma } = { ...this };

            await prisma.$transaction([
                prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        friends: {
                            connect: {
                                id: friendId,
                            },
                        },
                    },
                }),
                prisma.friendRequest.deleteMany({
                    where: {
                        fromId: friendId,
                        toId: userId,
                    },
                }),
            ]);

            return res.status(HttpStatus.CREATED).end();
        } catch (err) {
            this.logger.error(
                `Error accepting request, user ID: ${userId}, friend ID: ${friendId}, error: ${err}`,
            );

            throw new InternalServerErrorException('Failed to accept friend request');
        }
    }

    async getFriends(res: Response, user: User) {
        const { id: userId } = { ...user };

        try {
            const userData = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    friends: true,
                    friendOf: true,
                },
            });

            const allFriends = [...userData.friends, ...userData.friendOf];

            return allFriends;
        } catch (err) {
            this.logger.error(
                `Error getting friends, user ID: ${userId}, error: ${err}`,
            );

            throw new InternalServerErrorException('Failed to get friends');
        }
    }
}
