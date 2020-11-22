import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import * as BCRYPT from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ){}

    findAll(): Promise<User[]>{
        return this.userRepository.find({relations: ['board']});
    }

    async findOneById(id: number): Promise<User>{
        try{
            const result = await this.userRepository.findOne(id, {relations: ['board']});
            if(!result) throw new NotFoundException(`ID: ${id} is not found`);
            return Promise.resolve(result);
        }catch(err){
            return Promise.reject(err);
        }
    }

    async findOneByEmail(email: string): Promise<User>{
        try{
            const result = await this.userRepository.findOne({email}, {relations: ['board']});
            if(!result) throw new NotFoundException(`이메일(${email})을 찾을 수 없습니다.`);
            return Promise.resolve(result);
        }catch(err){
            return Promise.reject(err);
        }
    }

    async create(userData: CreateUserInput, context): Promise<User>{
        try{
            const emailCheck = await this.userRepository.findOne({email: userData.email});
            if(emailCheck) throw new Error(`${userData.email}이 이미 존재합니다.`);

            const user = new User();
            user.email = userData.email;
            user.name = userData.name;
            user.admin = 0;

            // 암호화
            const saltRounds = 10;
            const salt = BCRYPT.genSaltSync(saltRounds);
            const hash = BCRYPT.hashSync(userData.password, salt);

            user.password = hash;

            const result = await this.userRepository.save(user);

            // 토큰 저장
            const token = this.jwtService.sign({
                id: result.id,
                email: result.email,
                name: result.name,
                admin: result.admin
            });

            const exdays = 1;
            context.res.cookie('token', token, {httpOnly: true, expires: new Date(Date.now() + (exdays*24*60*60*1000))});

            return Promise.resolve(result);
        }catch(err){
            return Promise.reject(err);
        }
    }

    async update(userData: UpdateUserInput): Promise<Boolean>{
        try{
            await this.findOneById(userData.id);

            const user = new User();
            user.email = userData.email;
            user.password = userData.password;
            user.name = userData.name;
            user.admin = userData.admin;

            await this.userRepository.update(userData.id, user);

            return Promise.resolve(true);
        }catch(err){
            return Promise.reject(err);
        }
    }

    async delete(id: number): Promise<Boolean>{
        try{
            await this.findOneById(id);
            await this.userRepository.delete(id);
            return Promise.resolve(true);
        }catch(err){
            return Promise.reject(err);
        }
    }
}
