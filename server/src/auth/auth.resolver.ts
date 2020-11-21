import { Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { UserModel } from 'src/user/model/user.model';
import { AuthService } from './auth.service';
import { ProfileModel } from './model/profile.model';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ){}
    
    @Mutation(() => UserModel)
    async login(@Args('email') email: string, @Args('password') password: string, @Context() context){
        return this.authService.login(email, password, context);
    }

    @Mutation(() => Boolean)
    logout(@Context() context){
        return this.authService.logout(context);
    }

    @Mutation(() => ProfileModel)
    getProfile(@Context() context){
        return this.authService.getProfile(context);
    }    
}
