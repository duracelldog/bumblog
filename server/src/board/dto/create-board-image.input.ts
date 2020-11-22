import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBoardImageInput{
    @Field()
    originalName!: string;

    @Field()
    fileName!: string;

    @Field(type => Int)
    boardId!: number;
}