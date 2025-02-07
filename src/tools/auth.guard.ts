import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Check for authorization header to be present 
    if (!request.headers.authorization) {
      throw new UnauthorizedException('Token missing');
    }

    // Get the token from the headers 
    const token = request.headers.authorization.split(' ')[1];

    try {
      if (!this.jwtService.verify(token, { secret: process.env.JWT_SECRET })) {
        throw new UnauthorizedException('Not Authenticated');
      }

      // Decode the token 
      const decoded = this.jwtService.decode(token);

      const { expiresIn = '' } = { ...decoded };

      // Check for expiration date 
      if (!expiresIn) {
        throw new UnauthorizedException('Wrong credentials');
      }

      // Check if token has expired
      if (Number(expiresIn) < Date.now()) {
        throw new UnauthorizedException('Session expired');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Wrong credentials');
    }
  }
}
