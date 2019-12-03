import { InputType, Field } from "type-graphql";
import { MaxLength, MinLength } from "class-validator";
import Project from "../entity/Project.entity";

@InputType()
export default class CreateProjectArgs implements Partial<Project> {
  @MinLength(5, {
    message: "Name needs to be at least 5 characters long"
  })
  @MaxLength(255, {
    message: "Name can't be longer than 255 characters"
  })
  @Field(() => String, { nullable: false })
  name: string;
}
