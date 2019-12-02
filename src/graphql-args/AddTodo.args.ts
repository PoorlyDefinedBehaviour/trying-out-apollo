import { InputType, Field } from "type-graphql";
import { MaxLength, MinLength, IsString } from "class-validator";
import Todo from "../entity/Todo.entity";

@InputType()
export default class AddTodoArgs implements Partial<Todo> {
  @MinLength(5)
  @MaxLength(255)
  @IsString()
  @Field(() => String, { nullable: false })
  description: string;
}
