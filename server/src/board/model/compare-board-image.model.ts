import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CompareBoardImageModel{
    @Field()
    id: string;

    @Field(type => CompareImageModel, {nullable: true})
    t_file: CompareImageModel;

    @Field(type => [CompareImageModel], {nullable: true})
    c_files: CompareImageModel[]
}

class CompareImageModel{
    @Field()
    id: string;

    @Field()
    originalName: string;

    @Field()
    fileName: string;
}