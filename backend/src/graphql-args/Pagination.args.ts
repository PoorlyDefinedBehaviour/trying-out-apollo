import { Min } from "class-validator";
import { Field, Int, InputType } from "type-graphql";

@InputType()
export default class Pagination {
  @Min(1, { message: "Take can't be less than 1" })
  @Field(() => Int, { defaultValue: 999999999 })
  take!: number;

  @Min(0, { message: "Skip can't be less than 0" })
  @Field(() => Int, { defaultValue: 0 })
  skip!: number;
}