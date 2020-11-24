import { Args, Mutation, Resolver, Context, Query, Subscription } from '@nestjs/graphql';
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

    @Subscription(() => ProfileModel, {name: 'checkLogin'})
    checkLogin(){
        return pubSub.asyncIterator('checkLogin');
    }

    @Query(() => ProfileModel)
    getProfile(@Context() context){
        const result = this.authService.getProfile(context);
        pubSub.publish('checkLogin', {checkLogin: result});
        return result;
    }

    @Mutation(() => UserModel)
    async login(@Args('email') email: string, @Args('password') password: string, @Context() context){
        const result = await this.authService.login(email, password, context);
        pubSub.publish('checkLogin', {checkLogin: result});
        return result;
    }

    @Mutation(() => Boolean)
    logout(@Context() context){
        pubSub.publish('checkLogin', {checkLogin: false});
        return this.authService.logout(context);
    }   
}
