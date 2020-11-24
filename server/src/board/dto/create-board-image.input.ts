import { Field, InputType, Int } from '@nestjs/graphql';
import { FileInput } from './file.input';

@InputType()
export class CreateBoardImageInput{
    @Field(type => [FileInput])
    t_file: FileInput[];

    @Field(type => [FileInput])
    c_files: FileInput[];
}