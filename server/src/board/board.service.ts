import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardImageInput } from './dto/create-board-image.input';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { BoardImage } from './entities/board-image.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
        @InjectRepository(BoardImage)
        private boardImageRepository: Repository<BoardImage>
    ){}

    findAllBoardList(target: string, word: string, limit: number): Promise<Board[]>{
        // return this.boardRepository.find({relations: ['user']});
        return this.boardRepository
            .createQueryBuilder('board')
            .leftJoinAndSelect('board.user', 'user')
            .leftJoinAndSelect('board.boardImages', 'boardImage')
            .where(`board.${target} like :word`, {word: `%${word}%`})
            .take(limit)
            .orderBy("board.id", "DESC")
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

    async createBoardList(boardData: CreateBoardInput): Promise<Boolean>{
        try{
            boardData.createdAt = new Date();
            await this.boardRepository.save(boardData);
            return Promise.resolve(true);
        }catch(err){
            return Promise.reject(err);
        }
    }

    async updateBoardList(boardData: UpdateBoardInput): Promise<Boolean>{
        try{
            const result = await this.findOneBoardList(boardData.id);
            const updateData = {
                ...result,
                ...boardData
            }
            delete updateData.id;
            delete updateData.user;
            updateData.updatedAt = new Date();

            await this.boardRepository.update(boardData.id, updateData)

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

    async createBoardImage(boardImageData: CreateBoardImageInput){
        try{
            await this.boardImageRepository.save(boardImageData)
            return Promise.resolve(true);
        }catch(err){
            return Promise.reject(err);
        }
    }

    async deleteBoardImage(id: number): Promise<Boolean>{
        try{
            const result = await this.boardImageRepository.findOne({id});
            if(!result) throw new NotFoundException(`해당 이미지를 찾을 수 없습니다.`);
            this.boardImageRepository.delete(id)

            return Promise.resolve(true);
        }catch(err){
            return Promise.reject(err);
        }
    }
}
