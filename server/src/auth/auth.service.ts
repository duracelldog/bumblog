import { Injectable } from '@nestjs/common';
import * as BCRYPT from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { rejects } from 'assert';

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
            const result = BCRYPT.compareSync(password, user.password);
    
            if(user && result){
                // 로그인 성공
                return Promise.resolve(user);
            }else{
                // 로그인 실패
                throw new Error('login fail');
            }
        }catch(err){
            return Promise.reject(err);
        }
    }

    async login(user: User){
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
            console.log('user', user);
            return Promise.resolve(user);
        }catch(err){
            return Promise.reject(err);
        } 
    }
}
