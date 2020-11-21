import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Board } from "src/board/entities/board.entity";

@ObjectType()
export class UserModel{
    @Field(type => Int, {nullable: true})
    id: number;

    @Field({nullable: true})
    email: string;

    @Field({nullable: true})
    password: string;

    @Field({nullable: true})
    name: string;

    @Field({nullable: true})
    admin: number;

    @Field(type => [Board], {nullable: true})
    board: Board[];
}