import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Board } from "./board.entity";

@ObjectType()
@Entity({name: 'board_image'})
export class BoardImage{
    @Field(type => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    originalName: string;

    @Field()
    @Column()
    fileName: string;

    @Field()
    @Column()
    boardId: number;

    @Field(type => Board)
    @ManyToOne(() => Board, board => board.boardImages,{
        onDelete: 'CASCADE'
    })
    board: Board;
}