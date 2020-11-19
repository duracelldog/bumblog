import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateBoardInput } from './dto/create-board.input';
import { UpdateBoardInput } from './dto/update-board.input';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';
import { DeleteResult } from 'typeorm';

@Resolver()
export class BoardResolver {
    constructor(
        private readonly boardService: BoardService
    ){}

    @Query(() => [Board])
    async boardLists(){
        return await this.boardService.findAll();
    }

    @Query(() => Board, {nullable: true})
    async boardList(@Args('id', {type: () => Int}) id: number){
        return this.boardService.findOne(id);
    }

    @Mutation(() => Board)
    async createBoardList(@Args('boardData') boardData: CreateBoardInput){
        return this.boardService.create(boardData);
    }

    @Mutation(() => Boolean)
    async updateBoardList(@Args('boardData') boardData: UpdateBoardInput){
        return this.boardService.update(boardData);
    }

    @Mutation(() => Boolean)
    async deleteBoardList(@Args('id', {type: () => Int}) id: number){
        return this.boardService.delete(id);
    }
}
