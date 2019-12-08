import { InputType, Field } from "type-graphql";
import { MaxLength, MinLength } from "class-validator";
import User from "../entity/User.entity";

@InputType()
export default class ChangePasswordArgs implements Partial<User> {
  @MinLength(6, { message: "Password needs to be at least 6 characters long" })
  @MaxLength(255, { message: "Password can't be longer than 255 characters" })
  @Field(() => String)
  password!: string;

  @MinLength(6, { message: "A token is required" })
  @Field(() => String)
  token!: string;
}
