import {
    UnauthorizedException,
    createParamDecorator,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const Authorization = createParamDecorator(
    (_, request: any) => {

    // Get the authorization header from the request 
    const authorization = request.args[0].rawHeaders[1];
    const accessToken = authorization.split(' ')[1];

    try {
        // Decode the token 
        const decoded = new JwtService().decode(accessToken);

        return decoded;
    } catch (ex) {
        throw new UnauthorizedException();
    }
});