import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinTable
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import Project from "./Project.entity";

@ObjectType()
@Entity()
export default class Done extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Project)
  @ManyToOne(
    () => Project,
    project => project.done
  )
  @JoinTable()
  project: Project;
}
