import { InputType, Field } from "type-graphql";
import { MaxLength, MinLength } from "class-validator";
import Todo from "../entity/Todo.entity";

@InputType()
export default class AddTodoArgs implements Partial<Todo> {
  @MinLength(5, {
    message: "Description needs to be at least 5 characters long"
  })
  @MaxLength(255, {
    message: "Description can't be longer than 255 characters"
  })
  @Field(() => String, { nullable: false })
  description: string;
}
