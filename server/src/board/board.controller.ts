import { Body, Controller, Delete, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
    deleteFiles(@Body('id') id: string, @Body('t_file') t_file: string, @Body('c_files') c_files: string){

        const viewData = {
            id: id,
            t_file: JSON.parse(t_file),
            c_files: JSON.parse(c_files)
        }

        this.boardService.compareFilesAndDelete(viewData);
    }
}
