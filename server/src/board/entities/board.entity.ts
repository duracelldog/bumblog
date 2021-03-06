import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany, OneToOne } from 'typeorm';
import { BoardImage } from './board-image.entity';

@ObjectType()
@Entity()
export class Board{
    @Field(type => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    tags: string;

    @Field()
    @Column()
    contents: string;

    @Field()
    @Column()
    userId: number;

    @Field(type => Date, {nullable: true, defaultValue: new Date()})
    @Column()
    createdAt: Date;

    @Field(type => Date, {nullable: true, defaultValue: new Date()})
    @Column()
    updatedAt: Date;

    @Field({nullable: true, defaultValue: ""})
    @Column()
    t_originalName: string;

    @Field({nullable: true, defaultValue: ""})
    @Column()
    t_fileName: string;

    @Field(type => User, {nullable: true})
    @ManyToOne(() => User, user => user.board, {
        onDelete: 'CASCADE'
    })
    user: User;

    @Field(type => [BoardImage], {nullable: true})
    @OneToMany(() => BoardImage, boardImage => boardImage.board, {
        onDelete: 'CASCADE'
    })
    boardImages: BoardImage[];
}