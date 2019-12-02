import { InputType, Field } from "type-graphql";
import { IsIn } from "class-validator";
import Todo from "../entity/Todo.entity";

@InputType()
export default class UpdateTodoStatusArgs implements Partial<Todo> {
  @IsIn(["waiting", "ongoing", "done"])
  @Field(() => String, { nullable: false })
  status: string;
}
