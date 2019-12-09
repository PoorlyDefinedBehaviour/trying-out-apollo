import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, Float } from "type-graphql";
import User from "./User.entity";

@ObjectType()
@Entity("job")
export default class Job extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.jobs, { eager: true, onUpdate: "CASCADE" })
  poster!: User;

  @Field(() => String)
  @Column()
  title!: string;

  @Field(() => String)
  @Column()
  description!: string;

  @Field(() => Float)
  @Column()
  pay!: number;

  @Field(() => Boolean)
  @Column()
  remote!: boolean;

  @Field(() => String)
  @Column()
  state!: string;

  @Field(() => String)
  @Column()
  city!: string;

  @Field(() => String)
  @Column()
  journey!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: string;
}
