import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService
    ){}

    @Query(() => [User])
    async users(){
        return await this.userService.findAll();
    }

    @Query(() => User, {nullable: true})
    async user(@Args('id', {type: () => Int}) id: number){
        return this.userService.findOneById(id);
    }

    @Mutation(() => User)
    async createUser(@Args('userData') userData: CreateUserInput, @Context() context){
        return this.userService.create(userData, context);
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
