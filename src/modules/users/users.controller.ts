import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../../tools/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor (
        private usersService: UsersService
    ) {}

    @Get("search")
    async searchUsers(
        @Query("firstName") firstName: string,
        @Query("lastName") lastName: string,
        @Query("email") email: string,
        @Query("age") age: number,
    ) {
        return await this.usersService.searchUsers(firstName, lastName, email, age);
    }
}
