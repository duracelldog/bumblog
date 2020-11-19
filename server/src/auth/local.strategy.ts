import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "src/user/entities/user.entity";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({
            usernameField: 'email',
            passwordField: 'password'
        });
    }

    async validate(email: string, password: string): Promise<User>{
        try{
            const user = await this.authService.validateUser(email, password);
            if(!user) throw new UnauthorizedException();
            return Promise.resolve(user);
        }catch(err){
            return Promise.reject(err);
        }
    }
}