import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';

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

    @Query(() => Board, {nullable: true})
    async boardList(@Args('id', {type: () => Int}) id: number){
        return this.boardService.findOneBoardList(id);
    }

    @Mutation(() => Board)
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
}
