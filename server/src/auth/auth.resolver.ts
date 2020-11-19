import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { ProfileModel } from './model/profile.model';
import { TokenModel } from './model/token.model';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ){}
    
    @Mutation(() => TokenModel)
    async login(@Args('email') email: string, @Args('password') password: string){
        const user = await this.authService.validateUser(email, password);
        return this.authService.login(user);
    }

    @Query(() => ProfileModel)
    getProfile(@Args('access_token') access_token: string){
        return this.authService.decode(access_token);
    }    
}
