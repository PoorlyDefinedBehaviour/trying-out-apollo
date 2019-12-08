import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { hash, compare } from "bcryptjs";
import Job from "./Job.entity";

@ObjectType()
@Entity("user")
export default class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string;

  @Field(() => [Job], { defaultValue: [] })
  @OneToMany(() => Job, (job) => job.poster)
  jobs: Job[];

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: string;

  async setPassword(password: string): Promise<void> {
    const SALT_ROUNDS = 10;
    this.password = await hash(password, SALT_ROUNDS);
  }

  async isPasswordCorrect(password: string): Promise<boolean> {
    const correct = await compare(password, this.password);
    return correct;
  }
}
