import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { bumblog } from "src/config/bumblog.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: bumblog.jwt.secret
        });
    }

    async validate(payload: any){
        console.log('JwtStrategy', payload);
        return {
            email : payload.email,
            name: payload.name
        }
    }
}