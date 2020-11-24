import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FileInput{
    @Field()
    fieldname: string;

    @Field()
    originalname: string;

    @Field()
    encoding: string;

    @Field()
    mimetype: string;

    @Field()
    destination: string;

    @Field()
    filename: string;

    @Field()
    path: string;

    @Field(type => Int)
    size: number;
}