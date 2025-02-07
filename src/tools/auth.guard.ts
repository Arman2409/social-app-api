import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const Authorization = createParamDecorator((_, request: any) => {
  
  const authorization = request.args[0].rawHeaders[1];
  const accessToken =  authorization.split(' ')[1];

  try {
    const decoded = new JwtService().decode(accessToken);

    return decoded;
  } catch (ex) {
    throw new UnauthorizedException();
  }
});

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      throw new UnauthorizedException('Token missing');
    }

    const token = request.headers.authorization.split(' ')[1];

    try {
      const decoded = this.jwtService.decode(token);

      const { expiresIn = "" } = { ...decoded }

      if (!expiresIn) {
        throw new UnauthorizedException("Wrong credentials");
      }

      if (Number(expiresIn) < Date.now()) {
        throw new UnauthorizedException("Session expired");
      }

      request.hello = "Hello"
      request.res.hello = "Hello"
      request.res.locals = {
        hello: "Hello"
      }
      request.myData = "sdsf"

      return true;
    } catch (error) {
      throw new UnauthorizedException("Wrong credentials");
    }
  }
}

