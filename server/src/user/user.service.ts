import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import * as BCRYPT from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
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
            if(!result) throw new NotFoundException(`ID: ${email} is not found`);
            return Promise.resolve(result);
        }catch(err){
            return Promise.reject(err);
        }
    }

    create(userData: CreateUserInput): Promise<User>{

        const user = new User();
        user.email = userData.email;
        user.name = userData.name;
        user.admin = userData.admin;

        // 암호화
        const saltRounds = 10;
        const salt = BCRYPT.genSaltSync(saltRounds);
        const hash = BCRYPT.hashSync(userData.password, salt);

        user.password = hash;

        return this.userRepository.save(user);
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
