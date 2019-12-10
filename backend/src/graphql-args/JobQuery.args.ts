import { InputType, Field, Float } from "type-graphql";
import Pagination from "./Pagination.args";

@InputType()
export default class JobQueryArgs extends Pagination {
  @Field(() => String, {nullable: true})
  value?: string;

  @Field(() => Float, { nullable: true })
  start?: number;

  @Field(() => Float, { nullable: true })
  end?: number;
}
