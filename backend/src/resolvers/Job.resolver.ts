import {
  Resolver,
  Mutation,
  Query,
  Arg,
  Ctx,
  UseMiddleware
} from "type-graphql";
import Job from "../entity/Job.entity";
import CreateJobArgs from "../graphql-args/CreateJob.args";
import sessionRequired from "../middlewares/SessionRequired.middleware";
import { Between, Like, getConnection } from "typeorm";
import JobQueryArgs from "../graphql-args/JobQuery.args";

@Resolver(() => Job)
export default class JobResolver {
  @Query(() => [Job])
  @UseMiddleware(sessionRequired)
  async findJobsByUser(@Ctx() { req }) {
    const jobs = await Job.find({ poster: req.session.userId });
    return jobs;
  }

  @Query(() => [Job])
  async findJobsByState(@Arg("payload") { value, skip, take }: JobQueryArgs) {
    const jobs = await getConnection()
      .getRepository(Job)
      .find({
        relations: ["poster"],
        where: {
          state: value
        },
        skip,
        take
      });

    return jobs;
  }

  @Query(() => [Job])
  async findJobsByCity(@Arg("payload") { value, skip, take }: JobQueryArgs) {
    const jobs = await getConnection()
      .getRepository(Job)
      .find({
        relations: ["poster"],
        where: {
          city: value
        },
        skip,
        take
      });

    return jobs;
  }

  @Query(() => [Job])
  async findJobsByJourney(@Arg("payload") { value, skip, take }: JobQueryArgs) {
    const jobs = await getConnection()
      .getRepository(Job)
      .find({
        relations: ["poster"],
        where: {
          journey: value
        },
        skip,
        take
      });

    return jobs;
  }

  @Query(() => [Job])
  async findJobsByPayRange(@Arg("payload") { start, end, skip, take }: JobQueryArgs) {
    const jobs = await getConnection()
      .getRepository(Job)
      .find({
        relations: ["poster"],
        where: {
          pay: Between(start, end)
        },
        skip,
        take
      });

    return jobs;
  }

  @Query(() => [Job])
  async findJobsByRemoteStatus(@Arg("payload") { value, skip, take }: JobQueryArgs) {
    const jobs = await getConnection()
      .getRepository(Job)
      .find({
        relations: ["poster"],
        where: {
          remote: value === "true" ? true : false
        },
        skip,
        take
      });

    return jobs;
  }

  @Query(() => [Job])
  async findJobsByTitle(@Arg("payload") { value, skip, take }: JobQueryArgs) {
    const jobs = await getConnection()
      .getRepository(Job)
      .find({
        relations: ["poster"],
        where: {
          title: Like(`%${value}%`)
        },
        skip,
        take
      });

    return jobs;
  }

  @Mutation(() => Job)
  @UseMiddleware(sessionRequired)
  async createJobPost(@Arg("payload") payload: CreateJobArgs, @Ctx() { req }) {
    const job = await Job.create(payload);
    job.poster = req.session.userId;

    await job.save();
    await job.reload();

    return job;
  }
}
