import { Resolver } from "type-graphql";
import User from "../entity/User.entity";

import ProjectService from "../services/Project.service";

@Resolver(() => User)
export default class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  public async create();
}
