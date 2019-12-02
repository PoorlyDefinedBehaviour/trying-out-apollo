import { InputType, Field } from "type-graphql";
import { MaxLength, MinLength, IsString } from "class-validator";
import Project from "../entity/Project.entity";

@InputType()
export default class CreateProjectArgs implements Partial<Project> {
  @MinLength(5)
  @MaxLength(255)
  @IsString()
  @Field(() => String, { nullable: false })
  name: string;
}
