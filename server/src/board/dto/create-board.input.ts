import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput{
    @Field()
    title!: string;

    @Field()
    tags!: string;

    @Field()
    contents!: string;

    @Field(type => Int)
    userId!: number;

    @Field(type => Date, {nullable: true})
    createdAt: Date;

    @Field({nullable: true})
    t_originalName: string;

    @Field({nullable: true})
    t_fileName: string;

    // @Field({nullable: true})
    // c_originalFileName: string;

    // @Field({nullable: true})
    // c_uploadFileName: string;   
}