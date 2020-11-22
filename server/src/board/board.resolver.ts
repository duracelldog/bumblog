import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { BoardImage } from './entities/board-image.entity';
import { CreateBoardImageInput } from './dto/create-board-image.input';

@Resolver()
export class BoardResolver {
    constructor(
        private readonly boardService: BoardService
    ){}

    @Query(() => [Board])
    async boardLists(
        @Args('target', {nullable: true, defaultValue: 'title'}) target: string, 
        @Args('word',{nullable: true, defaultValue: ''}) word: string, 
        @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number
    ){
        return await this.boardService.findAllBoardList(target, word, limit);
    }

    @Mutation(() => Board, {nullable: true})
    async boardList(@Args('id', {type: () => Int}) id: number){
        return this.boardService.findOneBoardList(id);
    }

    @Mutation(() => Boolean)
    async createBoardList(@Args('boardData') boardData: CreateBoardInput){
        return this.boardService.createBoardList(boardData);
    }

    @Mutation(() => Boolean)
    async updateBoardList(@Args('boardData') boardData: UpdateBoardInput){
        return this.boardService.updateBoardList(boardData);
    }

    @Mutation(() => Boolean)
    async deleteBoardList(@Args('id', {type: () => Int}) id: number){
        return this.boardService.deleteBoardList(id);
    }

    @Mutation(() => Boolean)
    createBoardImage(@Args('boardImageData') boardImageData: CreateBoardImageInput){
        return this.boardService.createBoardImage(boardImageData);
    }
    
    @Mutation(() => Boolean)
    deleteBoardImage(@Args('id', {type: () => Int}) id: number){
        return this.boardService.deleteBoardImage(id);
    }
}
