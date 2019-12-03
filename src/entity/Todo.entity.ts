import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import Project from "./Project.entity";

@ObjectType()
@Entity("todo")
export default class Todo extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ nullable: false })
  description: string;

  @Field(() => String)
  @Column({ nullable: false, default: "waiting" })
  status: string;

  @Field(() => Project)
  @ManyToOne(
    () => Project,
    project => project.todos
  )
  @JoinTable()
  project: Project;

  @CreateDateColumn()
  createdAt: number;

  @UpdateDateColumn()
  updatedAt: number;
}
