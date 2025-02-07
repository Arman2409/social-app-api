import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Response } from 'express';

import { PrismaService } from '../../tools/services/database.service';
import { LoggerService } from '../../tools/services/logger.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService) { }

  async searchUsers(
    res: Response,
    firstName: string,
    lastName: string,
    email: string,
    age: number,
  ) {
    try {
      // Check for at least one of the queries to be present 
      if (!firstName && !lastName && !email && !age) {
        throw new BadRequestException('Search queries not provided');
      }

      // Search the database using the queries from the request  
      const result = await this.prisma.user.findMany({
        where: {
          AND: [
            firstName
              ? { firstName: { contains: firstName, mode: 'insensitive' } }
              : {},
            lastName
              ? { lastName: { contains: lastName, mode: 'insensitive' } }
              : {},
            email
              ? { lastName: { contains: lastName, mode: 'insensitive' } }
              : {},
            age ? { age: age } : {},
          ],
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          age: true,
        },
      });

      return res.status(HttpStatus.OK).send(result);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }

      this.logger.error(
        `Error while searching the user, params: ${{
          firstName,
          lastName,
          email,
          age,
        }}, error: ${err}`,
      );

      throw new InternalServerErrorException('Failed to search users');
    }
  }
}
