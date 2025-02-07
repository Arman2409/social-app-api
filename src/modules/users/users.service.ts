import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../../tools/database.service';
import { LoggerService } from 'src/tools/logger.service';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private logger: LoggerService
    ) { }

    async searchUsers(
        firstName: string,
        lastName: string,
        email: string,
        age: number) {
        try {
            // const searchParams = {
            //     AND: [
            //         firstName ? { firstName: { contains: firstName, mode: 'insensitive' } } : undefined,
            //         lastName ? { lastName: { contains: lastName, mode: 'insensitive' } } : undefined,
            //         age ? { age: age } : undefined,
            //     ]
            // }


            if (!firstName && !lastName && !email && !age) {
                throw new BadRequestException("Search queries not provided");
            }

            const result = await this.prisma.user.findMany({
                where: {
                    AND: [
                        firstName ? { firstName: { contains: firstName, mode: 'insensitive' } } : {},
                        lastName ? { lastName: { contains: lastName, mode: 'insensitive' } } : {},
                        age ? { age: age } : {},
                    ]
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    age: true
                }
            })

            return result;
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }

            this.logger.error(`Error while searching the user, params: ${{
                firstName,
                lastName,
                email,
                age
            }}, error: ${err}`);

            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}
