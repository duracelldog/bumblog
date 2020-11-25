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
import { CompareBoardImageModel } from './model/compare-board-image.model';

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

    async createBoardList(boardData: CreateBoardInput): Promise<Board>{
        try{
            boardData.createdAt = new Date();
            const result = await this.boardRepository.save(boardData);
            return Promise.resolve(result);
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
            const board = await this.findOneBoardList(id);
            const imagePath = resolve('./public/images/board');
            if(board.t_fileName){
                const filePath = join(imagePath, board.t_fileName);
                const state = statSync(filePath);
                if(state){
                    unlinkSync(filePath)
                }else{
                    throw new Error(`${board.t_fileName} 파일 삭제 실패`);
                }
            }
        
            const boardImages = await this.boardImageRepository.find({boardId: id});
            if(boardImages.length > 0){
                boardImages.forEach(image => {
                    const filePath = join(imagePath, image.fileName);
                    const state = statSync(filePath);
                    if(state){
                        unlinkSync(filePath)
                    }else{
                        throw new Error(`${image.fileName} 파일 삭제 실패`);
                    }
                })
            }
            
            await this.boardRepository.delete(id);
            return Promise.resolve(true);
        }catch(err){
            return Promise.reject(err);
        }
    }

    



    async createBoardImage(boardId:number, boardImageData: CreateBoardImageInput){
        try{
            if(!boardId) throw new Error(`boardId 값이 없습니다.`);

            // t_file
            if(boardImageData.t_file){
                boardImageData.t_file.forEach(async file => {
                    const t_file = new UpdateBoardInput();
                    t_file.id = boardId;
                    t_file.t_fileName = file.filename;
                    t_file.t_originalName = file.originalname
        
                    await this.updateBoardList(t_file);
                });
            }
            
            // c_files
            const boardList = await this.boardRepository.findOne({id: boardId});
            let contentsText = boardList.contents;

            if(boardImageData.c_files){
                boardImageData.c_files.forEach(async (file, index) => {

                    // 이미지 경로 실제 경로로 교체
                    contentsText = contentsText.replace(
                        new RegExp(`contentsImage-${index+1}\"`, "gi"), 
                        `contentsImage" src="/public/images/board/${file.filename}"`
                    );

                    // 파일 이름 board_image 디비에 저장
                    const c_file = {
                        fileName: file.filename,
                        originalName: file.originalname,
                        boardId: boardId
                    }
                    await this.boardImageRepository.save(c_file);
                })
            }

            // 이미지 경로 수정
            const c_files = new UpdateBoardInput();
            c_files.id = boardId;
            c_files.contents = contentsText;
            await this.updateBoardList(c_files);


            return Promise.resolve(true);
        }catch(err){
            return Promise.reject(err);
        }
    }

    async compareFilesAndDelete(viewData: CompareBoardImageModel){

        let boardIdForDelete = null;
        let boardImageIdsForDelete = [];

        try{
            // t_file
            const boardList = await this.boardRepository.findOne({id: +viewData.id});
            if(boardList.t_fileName && !viewData.t_file){
                boardIdForDelete = +viewData.id;
            }

            // c_files
            const boardImageLists = await this.boardImageRepository.find({boardId: +viewData.id});
            if(boardImageLists.length > 0){
                boardImageLists.forEach(list => {
                    let deleteFlag = true;
    
                    viewData.c_files.forEach(file =>{
                        if(list.fileName === file.fileName){
                            deleteFlag = false;
                        }
                    })
    
                    if(deleteFlag){
                        boardImageIdsForDelete.push(+list.id);
                    }
                });
            }
            
            this.deleteBoardImage(boardIdForDelete, boardImageIdsForDelete);
            
        }catch(err){
            return Promise.reject(err);
        }

        
    }

    async deleteBoardImage(boardId: number, boardImageIds: number[]): Promise<Boolean>{

        console.log('deleteTarget');
        console.log("boardId", boardId);
        console.log("boardImageIds", boardImageIds);

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
