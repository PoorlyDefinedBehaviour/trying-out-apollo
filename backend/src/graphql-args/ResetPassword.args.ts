import { InputType, Field } from "type-graphql";
import { IsEmail, MaxLength } from "class-validator";
import User from "../entity/User.entity";

@InputType()
export default class ResetPasswordArgs implements Partial<User> {
  @IsEmail({}, { message: "Email must be valid" })
  @MaxLength(255, { message: "Email can't be longer than 255 characters" })
  @Field(() => String, { nullable: false })
  email!: string;
}
