import { InputType, Field } from "type-graphql";
import { IsEmail, MaxLength, IsString, MinLength } from "class-validator";
import User from "../entity/User.entity";

@InputType()
export default class UserRegisterArgs implements Partial<User> {
  @IsEmail()
  @MaxLength(255)
  @Field(() => String, { nullable: false })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @Field(() => String, { nullable: false })
  password: string;
}
