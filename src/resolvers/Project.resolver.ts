import {
  Resolver,
  Mutation,
  Arg,
  UseMiddleware,
  Ctx,
  Query
} from "type-graphql";
import ProjectService from "../services/Project.service";
import Project from "../entity/Project.entity";
import requireAuthentication from "../middlewares/RequireAuthentication";
import { ApolloError } from "apollo-server-core";
import Todo from "../entity/Todo.entity";
import AddTodoArgs from "../graphql-args/AddTodo.args";
import UpdateTodoStatusArgs from "../graphql-args/UpdateTodoStatus.args";
import CreateProjectArgs from "../graphql-args/CreateProject.args";

@Resolver(() => Project)
export default class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => [Project])
  @UseMiddleware(requireAuthentication)
  public async findProjectsByOwner(@Ctx() { req }) {
    const owner = await req.user;
    const projects = await this.projectService.findManyBy({ owner });
    return projects;
  }

  @Query(() => Project, { nullable: true })
  @UseMiddleware(requireAuthentication)
  public async findProjectByName(@Arg("name") name: string, @Ctx() { req }) {
    const owner = await req.user;
    const project = await this.projectService.findOneBy({ name, owner });
    return project;
  }

  @Mutation(() => Project)
  @UseMiddleware(requireAuthentication)
  public async createProject(
    @Arg("payload") payload: CreateProjectArgs,
    @Ctx() { req }
  ) {
    const owner = await req.user;

    const projectExists = await this.projectService.projectExists({
      name: payload.name,
      owner
    });

    if (projectExists) {
      throw new ApolloError("A project with that name already exists");
    }

    const project = await this.projectService.create(owner, payload.name);
    return project;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(requireAuthentication)
  public async deleteProjectByName(@Arg("name") name: string, @Ctx() { req }) {
    const owner = await req.user;
    await this.projectService.deleteOneBy({ name, owner });
    return true;
  }

  @Mutation(() => Todo)
  @UseMiddleware(requireAuthentication)
  public async addTodoToProject(
    @Arg("name") name: string,
    @Arg("payload") payload: AddTodoArgs,
    @Ctx() { req }
  ) {
    const owner = await req.user;
    const project = await this.projectService.findOneBy({ name, owner });

    if (!project) {
      throw new ApolloError("Project not found");
    }

    const todo = new Todo();
    todo.project = project!;
    todo.description = payload.description;

    project.todos.push(todo);
    await project.save();

    return todo;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(requireAuthentication)
  public async updateTodoStatus(
    @Arg("name") name: string,
    @Arg("id") id: string,
    @Arg("payload") payload: UpdateTodoStatusArgs,
    @Ctx() { req }
  ) {
    const owner = await req.user;
    const project = await this.projectService.findOneBy({ name, owner });

    if (!project) {
      throw new ApolloError("Project not found");
    }

    const todo = project.todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new ApolloError("Todo not found");
    }

    todo.status = payload.status;
    await project.save();

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(requireAuthentication)
  public async removeTodoFromProjectById(
    @Arg("name") name: string,
    @Arg("id") id: string,
    @Ctx() { req }
  ) {
    const owner = await req.user;
    const project = await this.projectService.findOneBy({ owner, name });

    if (!project) {
      throw new ApolloError("Project not found");
    }

    const length = project.todos.length;

    project.todos = project.todos.filter((todo) => todo.id !== id);
    await project.save();

    return length !== project.todos.length;
  }
}
