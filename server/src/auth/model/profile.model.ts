import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ProfileModel{
    @Field(type => Int, {nullable: true})
    id: number;

    @Field({nullable: true})
    email: string;

    @Field({nullable: true})
    name: string;

    @Field({nullable: true})
    admin: number;

    @Field({nullable: true})
    iat: number;

    @Field({nullable: true})
    exp: number;
}