import { Injectable, InternalServerErrorException, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpStatusCode } from 'axios';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';

import { LoggerService } from '../../tools/logger.service';
import { PrismaService } from '../../tools/database.service';
import { LoginDTO, RegisterDTO } from '../../dto/auth';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private logger: LoggerService
    ) { }

    async register(@Res() res: Response, registerDto: RegisterDTO) {
        const { firstName, lastName, email, password, age } = { ...registerDto };

        try {
            const { logger, prisma } = { ...this };

            const existingUser = await prisma.user.findUnique({
                where: {
                    email
                }
            })

            if (existingUser) {
                logger.info(`User already exists, user email: ${email}`);
                throw new UnauthorizedException('User with email already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    age,
                    email,
                    password: hashedPassword
                }
            })

            logger.info(`User created, email: ${email}`);

            return res.status(HttpStatusCode.Created).end();
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            this.logger.error(`Error while registering the user, user email: ${email}, error: ${error}`);
            throw new InternalServerErrorException("Internal Server Error");
        }

    }

    async login(@Res() res: Response, loginDto: LoginDTO) {
        const { email, password } = { ...loginDto };

        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email
                }
            });

            if (!user) {
                this.logger.info(`User not found, user email: ${email}`)
                throw new NotFoundException("User not found");
            }

            if (await bcrypt.compare(password, user.password)) {

                const { password, createdAt, age, ...result } = { ...user };

                const expiresIn = Date.now() + 24* 60 * 60 * 1000; 

                const token = this.jwtService.sign(JSON.stringify({
                    ...result, 
                    expiresIn,
                    ...(age ? {age} : {})
                }), {
                    secret: process.env.JWT_SECRET,
                });
                
                return res.status(200).send({
                    token
                });
            }

            throw new UnauthorizedException('Invalid password');
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
                throw error;
            }

            this.logger.error(`Error while signing in the user, user email: ${email}, error: ${error}`);
            throw new InternalServerErrorException("Internal Server Error");
        }
    }
}
