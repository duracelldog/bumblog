import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

@InputType()
export class UpdateBoardInput{
    @Field(type => Int)
    id!: number;

    @Field()
    title: string;

    @Field()
    tags: string;

    @Field()
    contents: string;

    @Field(type => Int)
    userId: number;

    @Field({nullable: true})
    t_originalFileName: string;

    @Field({nullable: true})
    t_uploadFileName: string;

    @Field({nullable: true})
    c_originalFileName: string;

    @Field({nullable: true})
    c_uploadFileName: string;   
}