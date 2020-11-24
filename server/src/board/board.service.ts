import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardImageInput } from './dto/create-board-image.input';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { BoardImage } from './entities/board-image.entity';
import { Board } from './entities/board.entity';
import { statSync, unlinkSync } from 'fs';
import { resolve, join } from 'path';

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
            const result = await this.boardRepository.findOne(id, {relations: ['user', 'boardImages']});
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
            console.log('boardData', boardData);
            delete updateData.id;
            delete updateData.user;
            delete updateData.boardImages;
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

    



    async createBoardImage(boardId:number, boardImageData: CreateBoardImageInput){
        try{
            // t_file
            boardImageData.t_file.forEach(async file => {
                const t_file = new UpdateBoardInput();
                t_file.id = boardId;
                t_file.t_fileName = file.filename;
                t_file.t_originalName = file.originalname
    
                await this.updateBoardList(t_file);
            });

            // c_files
            boardImageData.c_files.forEach(async file => {
                const c_file = {
                    fileName: file.filename,
                    originalName: file.originalname,
                    boardId: boardId
                }
                await this.boardImageRepository.save(c_file);
            })

            return Promise.resolve(true);
        }catch(err){
            return Promise.reject(err);
        }
    }

    async deleteBoardImage(boardId: number, boardImageIds: string[]): Promise<Boolean>{

        const imagePath = resolve('./public/images/board');

        try{
            // t_file 
            if(boardId){
                // 파일 삭제
                const fileName = await this.boardRepository.findOne({id: boardId});
                const filePath = join(imagePath, fileName.t_fileName);

                const state = statSync(filePath);
                if(state){
                    unlinkSync(filePath)
                }else{
                    throw new Error(`${fileName} 파일 삭제 실패`);
                }

                // 데이터베이스 삭제
                const t_file = new UpdateBoardInput();
                t_file.id = boardId;
                t_file.t_fileName = null;
                t_file.t_originalName = null;
                await this.updateBoardList(t_file);
            }

            // c_files
            if(boardImageIds.length > 0){
                boardImageIds.forEach(async imageId => {
                    // 파일 삭제
                    const fileName = await this.boardImageRepository.findOne({id: +imageId});
                    const filePath = join(imagePath, fileName.fileName);

                    const state = statSync(filePath);
                    if(state){
                        unlinkSync(filePath)
                    }else{
                        throw new Error(`${fileName} 파일 삭제 실패`);
                    }

                    // 데이터베이스 삭제
                    await this.boardImageRepository.delete({id: +imageId});
                })
            }
            
            return Promise.resolve(true);

        }catch(err){
            return Promise.reject(err);
        }
    }
}
