import { InputType, Field } from "type-graphql";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import User from "../entity/User.entity";

@InputType()
export default class UserRegisterArgs implements Partial<User> {
  @IsEmail({}, { message: "Email must be valid" })
  @MaxLength(255, { message: "Email can't be longer than 255 characters" })
  @Field(() => String, { nullable: false })
  email: string;

  @MinLength(6, { message: "Password needs to be at least 6 characters long" })
  @MaxLength(255, { message: "Password can't be longer than 255 characters" })
  @Field(() => String, { nullable: false })
  password: string;
}
