import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlModule } from './mysql/mysql.module';
import { GraphqlModule } from './graphql/graphql.module';
import { BoardModule } from './board/board.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [MysqlModule, GraphqlModule, BoardModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
