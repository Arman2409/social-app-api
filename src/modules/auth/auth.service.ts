import {
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';

import { LoggerService } from '../../tools/services/logger.service';
import { PrismaService } from '../../tools/services/database.service';
import { LoginDTO, RegisterDTO } from '../../dto/auth';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private logger: LoggerService,
    ) { }

    async register(
        @Res() res: Response,
        registerDto: RegisterDTO
    ) {
        const { firstName, lastName, email, password, age } = { ...registerDto };

        try {
            const { logger, prisma } = { ...this };

            // Check if the email is already used  
            const existingUser = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (existingUser) {
                logger.info(`User already exists, user email: ${email}`);
                throw new UnauthorizedException('User with email already exists');
            }

            // Create hashed password for the user 
            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    age,
                    email,
                    password: hashedPassword,
                },
            });

            logger.info(`User created, email: ${email}`);

            return res.status(HttpStatus.CREATED).end();
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            this.logger.error(
                `Error while registering the user, user email: ${email}, error: ${error}`,
            );
            throw new InternalServerErrorException('Failed to create a user');
        }
    }

    async login(
        @Res() res: Response,
        loginDto: LoginDTO
    ) {
        const { email, password } = { ...loginDto };

        try {
            // Check if an user with the email exists 
            const user = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (!user) {
                this.logger.info(`User not found, user email: ${email}`);
                throw new NotFoundException('User not found');
            }

            // Compare the password from request body and database with Bcrypt 
            if (await bcrypt.compare(password, user.password)) {

                // Take the properties from the user which have to be sent to the client
                const { id, firstName, lastName, email, age } = { ...user };

                // Get new expiration date for the token 
                const expiresIn = Date.now() + 24 * 60 * 60 * 1000;

                // Get the token 
                const token = this.jwtService.sign(
                    JSON.stringify({
                        id,
                        firstName,
                        lastName,
                        email,
                        expiresIn,
                        ...(age ? { age } : {}),
                    }),
                    {
                        secret: process.env.JWT_SECRET,
                    },
                );

                return res.status(HttpStatus.OK).send({
                    token,
                });
            }

            throw new UnauthorizedException('Invalid password');
        } catch (error) {
            // Check if the error is one of the HTTP errors or another error  
            if (
                error instanceof NotFoundException ||
                error instanceof UnauthorizedException
            ) {
                throw error;
            }

            this.logger.error(
                `Error while signing in the user, user email: ${email}, error: ${error}`,
            );
            throw new InternalServerErrorException('Failed to log in');
        }
    }
}
