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
import { Between, Like } from "typeorm";

@Resolver(() => Job)
export default class JobResolver {
  @Query(() => [Job])
  @UseMiddleware(sessionRequired)
  async findJobsByUser(@Ctx() { req }) {
    const jobs = await Job.find({ poster: req.session.userId });
    return jobs;
  }

  @Query(() => [Job])
  async findJobsByState(@Arg("state") state: string) {
    const jobs = await Job.find({ state });
    return jobs;
  }

  @Query(() => [Job])
  async findJobsByCity(@Arg("city") city: string) {
    const jobs = await Job.find({ city });
    return jobs;
  }

  @Query(() => [Job])
  async findJobsByJourney(@Arg("journey") journey: string) {
    const jobs = await Job.find({ journey });
    return jobs;
  }

  @Query(() => [Job])
  async findJobsByPayRange(
    @Arg("start") start: number,
    @Arg("end") end: number
  ) {
    const jobs = await Job.find({ pay: Between(start, end) });
    return jobs;
  }

  @Query(() => [Job])
  async findOnlyRemoteJobs() {
    const jobs = await Job.find({ remote: true });
    return jobs;
  }

  @Query(() => [Job])
  async findJobsByTitle(@Arg("title") title: string) {
    const jobs = await Job.find({ title: Like(`%${title}%`) });
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
