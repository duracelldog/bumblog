import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ProfileModel{
    @Field(type => Int)
    id: number;

    @Field()
    email: string;

    @Field()
    name: string;

    @Field()
    admin: number;

    @Field()
    iat: number;

    @Field()
    exp: number;
}