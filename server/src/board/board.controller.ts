import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { BoardService } from './board.service';
import {diskStorage} from 'multer';
import { extname, resolve } from 'path';
import { v4 } from 'uuid';
import { CreateBoardImageInput } from './dto/create-board-image.input';

function uuid(){
    const uuid4 = v4().split('-');
    return uuid4[2] + uuid4[1] + uuid4[0] + uuid4[3] + uuid4[4];
}

@Controller('board')
export class BoardController {
    constructor(private readonly boardService: BoardService){}

    @Post('upload')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 't_file', maxCount: 1},
        {name: 'c_files', maxCount: 5}
    ], {
        storage: diskStorage({
            filename: (req, file, cb) => cb(null, uuid() + extname(file.originalname)),
            destination: resolve('./public/images/board')
        })
    }))
    uploadFiles(@Body('boardId') boardId: string, @UploadedFiles() files: CreateBoardImageInput){
        return this.boardService.createBoardImage(+boardId, files);
    }

    @Delete('upload')
    deleteFiles(@Body('boardId') boardId: string, @Body('boardImageIds') boardImageIds: string){
        console.log("boardId", boardId)
        console.log("boardImageIds", boardImageIds)
        return this.boardService.deleteBoardImage(+boardId, boardImageIds.split(','));
    }

    // files [Object: null prototype] {
    //     [1]   t_file: [
    //     [1]     {
    //     [1]       fieldname: 't_file',
    //     [1]       originalname: 'hero-image.jpg',
    //     [1]       encoding: '7bit',
    //     [1]       mimetype: 'image/jpeg',
    //     [1]       destination: '/Users/beomgeunshin/Desktop/bumblog/server/public/images/board',
    //     [1]       filename: '40e81381e2bffe1b999db4f041f9f841.jpg',
    //     [1]       path: '/Users/beomgeunshin/Desktop/bumblog/server/public/images/board/40e81381e2bffe1b999db4f041f9f841.jpg',
    //     [1]       size: 1128559
    //     [1]     }
    //     [1]   ],
    //     [1]   c_files: [
    //     [1]     {
    //     [1]       fieldname: 'c_files',
    //     [1]       originalname: 'hero-image-2.jpg',
    //     [1]       encoding: '7bit',
    //     [1]       mimetype: 'image/jpeg',
    //     [1]       destination: '/Users/beomgeunshin/Desktop/bumblog/server/public/images/board',
    //     [1]       filename: '483bcafec5b5925586850dafb993a619.jpg',
    //     [1]       path: '/Users/beomgeunshin/Desktop/bumblog/server/public/images/board/483bcafec5b5925586850dafb993a619.jpg',
    //     [1]       size: 8688040
    //     [1]     },
    //     [1]     {
    //     [1]       fieldname: 'c_files',
    //     [1]       originalname: 'hero-image.jpg',
    //     [1]       encoding: '7bit',
    //     [1]       mimetype: 'image/jpeg',
    //     [1]       destination: '/Users/beomgeunshin/Desktop/bumblog/server/public/images/board',
    //     [1]       filename: '48fe18aafb8216f0b228aeb85eed4dc9.jpg',
    //     [1]       path: '/Users/beomgeunshin/Desktop/bumblog/server/public/images/board/48fe18aafb8216f0b228aeb85eed4dc9.jpg',
    //     [1]       size: 1128559
    //     [1]     }
    //     [1]   ]
    //     [1] }

}
