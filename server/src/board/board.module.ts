import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardResolver } from './board.resolver';
import { BoardImage } from './entities/board-image.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Board, BoardImage])
    ],
    controllers: [BoardController],
    providers: [BoardService, BoardResolver]
})
export class BoardModule {}
