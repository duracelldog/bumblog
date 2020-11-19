import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class UpdateUserInput{
    @Field(type => Int)
    id: number;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    name: string;

    @Field({nullable: true})
    admin: number;
}