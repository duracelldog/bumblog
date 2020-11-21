import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateUserInput{
    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    name: string;

    @Field(Type => Int, {nullable: true})
    admin: number;
}