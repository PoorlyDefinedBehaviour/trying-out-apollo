import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  Column,
  OneToMany,
  ManyToOne
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import Todo from "./Todo.entity";
import OnGoing from "./OnGoing.entity";
import Done from "./Done.entity";
import User from "./User.entity";

@ObjectType()
@Entity()
export default class Project extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.projects
  )
  owner: User;

  @Field(() => [Todo])
  @Column("simple-array", { nullable: true })
  @OneToMany(
    () => Todo,
    todo => todo.project,
    { cascade: true }
  )
  todos: Todo[];

  @Field(() => [OnGoing])
  @Column("simple-array", { nullable: true })
  @OneToMany(
    () => OnGoing,
    onGoing => onGoing.project,
    { cascade: true }
  )
  ongoing: OnGoing[];

  @Field(() => [Done])
  @Column("simple-array", { nullable: true })
  @OneToMany(
    () => OnGoing,
    onGoing => onGoing.project,
    { cascade: true }
  )
  done: Done[];
}
