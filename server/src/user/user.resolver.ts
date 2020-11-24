import { Args, Context, Int, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthResolver } from 'src/auth/auth.resolver';
import { AuthService } from 'src/auth/auth.service';
import { ProfileModel } from 'src/auth/model/profile.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserModel } from './model/user.model';
import { UserService } from './user.service';
import { pubSub } from '../auth/auth.resolver';

@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ){}

    @Subscription(()=> ProfileModel, {name: 'checkLogin'})
    checkLogin(){
        return pubSub.asyncIterator('checkLogin');
    }

    @Query(() => [User])
    async users(){
        return await this.userService.findAll();
    }

    @Query(() => User, {nullable: true})
    async user(@Args('id', {type: () => Int}) id: number){
        return this.userService.findOneById(id);
    }

    @Mutation(() => UserModel)
    async createUser(@Args('userData') userData: CreateUserInput, @Context() context){
        const user = await this.userService.create(userData);
        const result = await this.authService.login(user.email, userData.password, context);
        pubSub.publish('checkLogin', {checkLogin: result});
        return result;
    }

    @Mutation(() => Boolean)
    async updateUser(@Args('userData') userData: UpdateUserInput){
        return this.userService.update(userData);
    }

    @Mutation(() => Boolean)
    async deleteUser(@Args('id', {type: () => Int}) id: number){
        return this.userService.delete(id);
    }
}
