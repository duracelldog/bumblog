import { Args, Mutation, Resolver, Context, Query } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { UserModel } from 'src/user/model/user.model';
import { AuthService } from './auth.service';
import { ProfileModel } from './model/profile.model';

export const pubSub = new PubSub();

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ){}

    @Query(() => ProfileModel)
    getProfile(@Context() context){
        const result = this.authService.getProfile(context);
        return result;
    }

    @Mutation(() => UserModel)
    async login(@Args('email') email: string, @Args('password') password: string, @Context() context){
        const result = await this.authService.login(email, password, context);
        return result;
    }

    @Mutation(() => Boolean)
    logout(@Context() context){
        return this.authService.logout(context);
    }   
}
