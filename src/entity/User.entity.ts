import {
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { hash, compare } from "bcryptjs";
import Project from "./Project.entity";

@ObjectType()
@Entity("user")
export default class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Field(() => [Project])
  @OneToMany(
    () => Project,
    project => project.owner
  )
  @JoinTable()
  projects: Project[];

  @CreateDateColumn()
  createdAt: number;

  @UpdateDateColumn()
  updatedAt: number;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const me = await User.findOne({ id: this.id }, { select: ["password"] });

    if (!me || !(await compare(me.password, this.password))) {
      this.password = await hash(this.password, 10);
    }
  }
}
