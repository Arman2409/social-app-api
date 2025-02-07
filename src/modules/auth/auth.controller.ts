import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';

import { LoginDTO, RegisterDTO } from '../../dto/auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('register')
  async register(
    @Res() res: Response,
    @Body() registerDto: RegisterDTO) {
    return this.authService.register(res, registerDto);
  }

  @Post('login')
  async login(
    @Res() res: Response,
    @Body() loginDto: LoginDTO) {
    return this.authService.login(res, loginDto);
  }
}
