import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { bumblog } from 'src/config/bumblog.config';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), 
        PassportModule.register({
            defaultStrategy: 'jwt'
        }), 
        JwtModule.register({
            secret: bumblog.jwt.secret,
            signOptions: {expiresIn: '60s'}
        })
    ],
    providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy],
    controllers: [AuthController]
})
export class AuthModule {}
