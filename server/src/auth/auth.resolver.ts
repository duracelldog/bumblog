import { ExecutionContext } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Context, GraphQLExecutionContext } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { ProfileModel } from './model/profile.model';
import { TokenModel } from './model/token.model';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ){}
    
    @Mutation(() => User)
    async login(@Args('email') email: string, @Args('password') password: string, @Context() context){
        const user = await this.authService.validateUser(email, password);
        const login = await this.authService.login(user);
        const token = login.access_token;

        const exdays = 1;
        context.res.cookie('token', token, {httpOnly: true, expires: new Date(Date.now() + (exdays*24*60*60*1000))});

        return user;
    }

    @Mutation(() => Boolean)
    logout(@Context() context){
        context.res.clearCookie('token');
        return true;
    }

    @Query(() => ProfileModel)
    getProfile(@Args('token') token: string){
        return this.authService.decode(token);
    }    
}
