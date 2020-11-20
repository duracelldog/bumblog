import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>
    ){}

    findAllBoardList(target: string, word: string, limit: number): Promise<Board[]>{
        // return this.boardRepository.find({relations: ['user']});
        return this.boardRepository
            .createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user')
            .leftJoinAndSelect('board.boardImages', 'boardImage')
            .where(`board.${target} like :word`, {word: `%${word}%`})
            .take(limit)
            .getMany();
    }

    async findOneBoardList(id: number): Promise<Board>{
        try{
            const result = await this.boardRepository.findOne(id, {relations: ['user']});
            if(!result) throw new NotFoundException(`ID: ${id} is not found`);
            return Promise.resolve(result);
        }catch(err){
            return Promise.reject(err);
        }
    }

    createBoardList(boardData: CreateBoardInput): Promise<Board>{
        return this.boardRepository.save(boardData);
    }

    async updateBoardList(boardData: UpdateBoardInput): Promise<Boolean>{
        try{
            await this.findOneBoardList(boardData.id);

            const board = new Board();
            board.title = boardData.title;
            board.contents = boardData.contents;
            board.userId = boardData.userId;

            await this.boardRepository.update(boardData.id, board);

            return Promise.resolve(true) ;
        }catch(err){
            return Promise.reject(err);
        }
    }

    async deleteBoardList(id: number): Promise<Boolean>{
        try{
            await this.findOneBoardList(id);
            await this.boardRepository.delete(id);
            return Promise.resolve(true);
        }catch(err){
            return Promise.reject(err);
        }
    }
}
