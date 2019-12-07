import faker from "faker";
import registerRandomUser from "../shared/utils/RegisterRandomUser";
import createProjectMutation from "../shared/mutations/CreateProject.mutation";
import api from "./Api";
import deleteProjectByNameMutation from "../shared/mutations/DeleteProjectByName.mutation";
import findProjectsByOwnerQuery from "../shared/queries/FindProjectsByOwner.query";
import findProjectByNameQuery from "../shared/queries/FindProjectByName.query";
import startServer from "../../src/Server";

let server;
beforeAll(async () => {
  server = await startServer();
});

afterAll(() => server.close());

describe("Project resolver test suite", () => {
  test("create a new project", async () => {
    const { token } = await registerRandomUser();

    const name = faker.random.alphaNumeric(10);

    const { data } = await api.post(
      "",
      {
        query: createProjectMutation(name)
      },
      { headers: { authorization: token } }
    );

    expect(data.data.createProject.name).toBe(name);
    expect(data.data.createProject.id).toBeDefined();
  });

  test("fail to create a new project without authorization token", async () => {
    const name = faker.random.alphaNumeric(10);

    const { data } = await api.post(
      "",
      {
        query: createProjectMutation(name)
      },
      { headers: { authorization: faker.random.alphaNumeric(10) } }
    );

    expect(data.errors[0].message).toBe("Unauthorized");
  });

  test("fail to create a new project with invalid name", async () => {
    const { token } = await registerRandomUser();
    const shortName = faker.random.alphaNumeric(3);

    const { data: shortNameData } = await api.post(
      "",
      {
        query: createProjectMutation(shortName)
      },
      { headers: { authorization: token } }
    );

    const longName = faker.random.alphaNumeric(3);
    const { data: longNameData } = await api.post(
      "",
      {
        query: createProjectMutation(longName)
      },
      { headers: { authorization: token } }
    );

    expect(shortNameData.errors[0].message).toBe("Argument Validation Error");
    expect(longNameData.errors[0].message).toBe("Argument Validation Error");
  });

  test("find all projects by owner", async () => {
    const { token } = await registerRandomUser();

    await Promise.all(
      Array(10)
        .fill(null)
        .map(() =>
          api.post(
            "",
            {
              query: createProjectMutation(faker.random.alphaNumeric(10))
            },
            { headers: { authorization: token } }
          )
        )
    );

    const { data } = await api.post(
      "",
      {
        query: findProjectsByOwnerQuery()
      },
      { headers: { authorization: token } }
    );

    expect(data.data.findProjectsByOwner.length).toBe(10);
  });

  test("fail to find all projects by owner without authorization token", async () => {
    const fakeToken = faker.random.alphaNumeric(10);

    const { data } = await api.post(
      "",
      {
        query: findProjectsByOwnerQuery()
      },
      { headers: { authorization: fakeToken } }
    );

    expect(data.errors[0].message).toBe("Unauthorized");
  });

  test("find one project by name", async () => {
    const { token } = await registerRandomUser();
    const name = faker.random.alphaNumeric(10);

    await api.post(
      "",
      {
        query: createProjectMutation(name)
      },
      { headers: { authorization: token } }
    );

    const { data } = await api.post(
      "",
      {
        query: findProjectByNameQuery(name)
      },
      { headers: { authorization: token } }
    );

    expect(data.data.findProjectByName.name).toBe(name);
  });

  test("fail to find one project by name without authorization token", async () => {
    const { token } = await registerRandomUser();
    const name = faker.random.alphaNumeric(10);

    await api.post(
      "",
      {
        query: createProjectMutation(name)
      },
      { headers: { authorization: token } }
    );

    const { data } = await api.post("", {
      query: findProjectByNameQuery(name)
    });

    expect(data.errors[0].message).toBe("Unauthorized");
  });

  test("fail to delete project by name without authorization token", async () => {
    const { token } = await registerRandomUser();

    const name = faker.random.alphaNumeric(10);

    await api.post(
      "",
      {
        query: createProjectMutation(name)
      },
      { headers: { authorization: token } }
    );

    const { data } = await api.post("", {
      query: deleteProjectByNameMutation(name)
    });

    expect(data.errors[0].message).toBe("Unauthorized");
  });
});
