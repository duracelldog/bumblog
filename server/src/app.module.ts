import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlModule } from './common/mysql.module';
import { GraphqlModule } from './common/graphql.module';
import { BoardModule } from './board/board.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StaticModule } from './common/static.module';


@Module({
  imports: [MysqlModule, GraphqlModule, StaticModule, BoardModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
