import { Service } from "typedi";
import Project from "../entity/Project.entity";
import User from "../entity/User.entity";

@Service()
export default class ProjectService {
  public async create(owner: User, name: string) {
    const project = new Project();
    project.name = name;
    project.owner = owner;

    await project.save();
    return project;
  }

  public findManyBy = async (predicate: Partial<Project>) =>
    await Project.find(predicate);

  public findOneBy = async <T>(predicate: Partial<Project>, options?: T) =>
    await Project.findOne(predicate, options);

  public projectExists = async <T>(predicate: Partial<Project>, options?: T) =>
    !!(await this.findOneBy(predicate, options));

  public deleteOneBy = async (predicate: Partial<Project>) =>
    await Project.delete(predicate);

  public updateOneBy = async (
    predicate: Partial<Project>,
    payload: Partial<Project>
  ) => await Project.update(predicate, payload);
}
