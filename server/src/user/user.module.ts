import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { JwtModule } from '@nestjs/jwt';
import { bumblog } from 'src/config/bumblog.config';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: bumblog.jwt.secret,
      signOptions: {expiresIn: '60s'}
    })
  ],
  providers: [UserService, UserResolver, AuthService],
  controllers: [UserController]
})
export class UserModule {}
