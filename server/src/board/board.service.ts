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

    findAll(): Promise<Board[]>{
        return this.boardRepository.find({relations: ['user']});
    }

    async findOne(id: number): Promise<Board>{
        try{
            const result = await this.boardRepository.findOne(id, {relations: ['user']});
            if(!result) throw new NotFoundException(`ID: ${id} is not found`);
            return Promise.resolve(result);
        }catch(err){
            return Promise.reject(err);
        }
    }

    create(boardData: CreateBoardInput): Promise<Board>{
        return this.boardRepository.save(boardData);
    }

    async update(boardData: UpdateBoardInput): Promise<Boolean>{
        try{
            await this.findOne(boardData.id);

            const board = new Board();
            board.title = boardData.title;
            board.tags = boardData.tags;
            board.contents = boardData.contents;
            board.userId = boardData.userId;

            await this.boardRepository.update(boardData.id, board);

            return Promise.resolve(true) ;
        }catch(err){
            return Promise.reject(err);
        }
    }

    async delete(id: number): Promise<Boolean>{
        try{
            await this.findOne(id);
            await this.boardRepository.delete(id);
            return Promise.resolve(true);
        }catch(err){
            return Promise.reject(err);
        }
    }
}
