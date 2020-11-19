import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Board } from "src/board/entities/board.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User{
    @Field(type => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    password: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    admin: number;

    @Field(type => [Board])
    @OneToMany(()=> Board, board => board.user, {
        onDelete: 'CASCADE'
    })
    board: Board[];
}