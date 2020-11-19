import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { bumblog } from '../config/bumblog.config';
import { Board } from '../board/entities/board.entity';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: bumblog.mysql.id,
            password: bumblog.mysql.password,
            database: 'bumblog',
            entities: [Board, User],
            synchronize: false
        })
    ]
})

export class MysqlModule {}