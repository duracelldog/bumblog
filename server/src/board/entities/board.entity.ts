import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

    @Field(type => String, {nullable: true})
    @Column('timestamptz')
    @CreateDateColumn()
    createdAt: string;

    @Field(type => String, {nullable: true})
    @Column('timestamptz')
    @CreateDateColumn()
    updatedAt: string;

    @Field({nullable: true})
    @Column()
    t_originalFileName: string;

    @Field({nullable: true})
    @Column()
    t_uploadFileName: string;

    @Field({nullable: true})
    @Column()
    c_originalFileName: string;

    @Field({nullable: true})
    @Column()
    c_uploadFileName: string;

    @Field(type => User)
    @ManyToOne(() => User, user => user.board, {
        onDelete: 'CASCADE'
    })
    user: User;
}