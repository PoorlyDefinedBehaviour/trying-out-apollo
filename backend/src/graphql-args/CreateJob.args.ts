import { InputType, Field, Float } from "type-graphql";
import { MaxLength, MinLength, Min, IsNotEmpty, IsIn } from "class-validator";
import Job from "../entity/Job.entity";

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const JOURNEYS = [
  "morning", "noon", "afternoon", "parttime", "fulltime"
];

@InputType()
export default class CreateJobArgs implements Partial<Job> {
  @MinLength(5, { message: "Title must be at least than 5 characters long" })
  @MaxLength(255, { message: "Title can't be longer than 255 characters" })
  @Field(() => String)
  title!: string;

  @MinLength(10, { message: "Description must be at least 10 characters long" })
  @MaxLength(255, { message: "Description can't be longer than 255 characters" })
  @Field(() => String)
  description!: string;

  @Min(0, { message: "Pay amount can't be negative" })
  @Field(() => Float)
  pay!: number;

  @IsNotEmpty({ message: "Remote must be set" })
  @Field(() => Boolean)
  remote!: boolean;

  @IsIn(STATES, { message: "State must be a brazilian state" })
  @Field(() => String)
  state!: string;

  @IsNotEmpty({ message: "A city must be specified" })
  @Field(() => String)
  city!: string;

  @IsIn(JOURNEYS, { message: `Journey must be one of [${JOURNEYS}]` })
  @Field(() => String)
  journey!: string;
}
