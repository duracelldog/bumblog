import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateBoardInput{
    @Field(type => Int)
    id!: number;

    @Field({nullable: true})
    title: string;

    @Field({nullable: true})
    tags: string;

    @Field({nullable: true})
    contents: string;

    @Field(type => Int, {nullable: true})
    userId: number;

    @Field(type => Date, {nullable: true})
    updatedAt: Date;

    @Field({nullable: true})
    t_originalName: string;

    @Field({nullable: true})
    t_fileName: string;

    // @Field({nullable: true})
    // c_originalFileName: string;

    // @Field({nullable: true})
    // c_uploadFileName: string;   
}