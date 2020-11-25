import { Injectable, NotFoundException } from '@nestjs/common';
import * as BCRYPT from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, password: string): Promise<User>{
        try{
            const user = await this.userRepository.findOne({email});
            if(!user){
                throw new ApolloError("이메일를 다시 확인해주세요.", "EMAIL_INVALID", {
                    parameter: "email"
                })
            }

            const result = BCRYPT.compareSync(password, user.password);
            if(!result){
                throw new ApolloError("비밀번호를 다시 확인해주세요.", "PASSWORD_INVALID", {
                    parameter: "password"
                })
            }

            return Promise.resolve(user);

        }catch(err){
            return Promise.reject(err);
        }
    }

    async login(email: string, password: string, context){
        try{
            const user = await this.validateUser(email, password);
            const token = await this.incode(user);
    
            const exdays = 1;
            context.res.cookie('token', token.access_token, {httpOnly: true, expires: new Date(Date.now() + (exdays*24*60*60*1000))});
    
            return Promise.resolve(user);
        }catch(err){
            return Promise.reject(err);
        }
    }

    logout(context){
        context.res.clearCookie('token');
        return true;
    }

    async getProfile(context){
        try{
            const token = context.req.cookies.token;
            if(!token) return new NotFoundException(`로그인 상태가 아닙니다.`);
    
            const userInfo: any = await this.decode(token);
            if(!userInfo) return new NotFoundException(`토큰이 올바르지 않습니다.`);
    
            const user = await this.userRepository.findOne({id: userInfo.id});
            if(!user) return new NotFoundException(`해당 유저가 없습니다.`);
    
            return Promise.resolve(userInfo);
        }catch(err){
            context.res.clearCookie('token');
            return Promise.reject(err)
        }
    }

    async incode(user: User){
        const payload = {
            id: user.id,
            email: user.email,
            name: user.name,
            admin: user.admin
        }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }

    async decode(token: string){
        try{
            const user = this.jwtService.decode(token);
            return Promise.resolve(user);
        }catch(err){
            return Promise.reject(err);
        } 
    }
}
