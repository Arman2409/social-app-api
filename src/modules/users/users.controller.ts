import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';

import { AuthGuard } from '../../tools/auth.guard';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) { }

  @Get('search')
  async searchUsers(
    @Res() res: Response,
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
    @Query('email') email: string,
    @Query('age') age: number,
  ) {
    return await this.usersService.searchUsers(res, firstName, lastName, email, age);
  }
}
