import {
    BadRequestException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import type { User } from '@prisma/client';
import type { Response } from 'express';

import { PrismaService } from '../../tools/services/database.service';
import { LoggerService } from '../../tools/services/logger.service';

@Injectable()
export class FriendsService {
    constructor(
        private prisma: PrismaService, private logger: LoggerService
    ) { }

    async addFriend(
        res: Response,
        user: User,
        friendId: string) {
        const { id: userId } = { ...user };

        try {
            if (!friendId) {
                throw new BadRequestException('Query userId not provided');
            }

            if (friendId === userId) {
                throw new BadRequestException("Can't send friend request yourself");
            }

            //   Check if the friend actually exists 
            const [friend, requests] = await this.prisma.$transaction([
                this.prisma.user.findUnique({
                    where: {
                        id: friendId
                    }
                }),
                this.prisma.friendRequest.findMany({
                    where: {
                        fromId: userId,
                        toId: friendId,
                    }
                }),
            ])

            if (!friend) {
                throw new BadRequestException("User with given ID not found")
            }

            if (requests.length) {
                throw new BadRequestException("Request already sent")
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
            if (err instanceof BadRequestException) {
                throw err;
            }

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
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return res.status(HttpStatus.OK).send(result);
        } catch (err) {
            this.logger.error(
                `Failed to get friend requests, user ID: ${userId}, error: ${err}`,
            );

            throw new InternalServerErrorException('Failed to get friend requests');
        }
    }

    async acceptRequest(
        res: Response,
        user: User,
        friendId: string) {
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

            logger.info(`Friend request accepted, user ID: ${userId}, user email: ${user.email}, friend ID: ${friendId}`);

            return res.status(HttpStatus.CREATED).end();
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }

            this.logger.error(
                `Error accepting request, user ID: ${userId}, friend ID: ${friendId}, error: ${err}`,
            );

            throw new InternalServerErrorException('Failed to accept friend request');
        }
    }

    async getFriends(res: Response, user: User) {
        const { id: userId } = { ...user };

        try {
            // Get user and the friends with relation 
            const userData = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    friends: true,
                    friendOf: true,
                },
            });

            // Put all the friends into one array 
            const allFriends = [...userData.friends, ...userData.friendOf];

            return res.status(HttpStatus.OK).send(allFriends);
        } catch (err) {
            this.logger.error(
                `Error getting friends, user ID: ${userId}, error: ${err}`,
            );

            throw new InternalServerErrorException('Failed to get the friends');
        }
    }
}
