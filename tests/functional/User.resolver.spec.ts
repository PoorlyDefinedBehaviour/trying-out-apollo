import faker from "faker";
import registerUserMutation from "../shared/mutations/RegisterUser.mutation";
import registerRandomUser from "../shared/utils/RegisterRandomUser";
import api from "./Api";
import startServer from "../../src/Server";

let server;
beforeAll(async () => {
  server = await startServer();
});

afterAll(() => server.close());

describe("User resolver test suite", () => {
  test("register user", async () => {
    const { data } = await api.post("", {
      query: registerUserMutation(
        faker.internet.email(),
        faker.internet.userName()
      )
    });

    expect(data.data.registerUser.id).toBeDefined();
    expect(data.errors).toBeUndefined();
  });

  test("fail to register user that already exists", async () => {
    const email = faker.internet.email();

    await api.post("", {
      query: registerUserMutation(email, faker.internet.password())
    });

    const { data } = await api.post("", {
      query: registerUserMutation(email, faker.internet.password())
    });

    expect(data.errors).toBeDefined();
    expect(data.errors[0].message).toBe("Email already in use");
  });

  test("fail to register user with login or password", async () => {
    const { data: invalidEmailData } = await api.post("", {
      query: registerUserMutation("invalidemail", faker.internet.password())
    });

    expect(invalidEmailData.errors).toBeDefined();
    expect(invalidEmailData.errors.length).toBeGreaterThan(0);

    const { data: invalidPasswordData } = await api.post("", {
      query: registerUserMutation(faker.internet.email(), "123")
    });

    expect(invalidPasswordData.errors).toBeDefined();
    expect(invalidPasswordData.errors.length).toBeGreaterThan(0);
  });

  test("login", async () => {
    const { email, password } = await registerRandomUser();

    const response = await api.post("", {
      query: `
      mutation {
        login(payload:{
          email:"${email}"
          password:"${password}"
        }) {
          id
          email
        }
      }`
    });

    expect(response.data.data.login.id).toBeDefined();
    expect(response.headers.authorization).toBeDefined();
  });

  test("fail to login with invalid credentials", async () => {
    const { email, password } = await registerRandomUser();

    const invalidEmailResponse = await api.post("", {
      query: `
      mutation {
        login(payload:{
          email:"${faker.internet.email()}"
          password:"${password}"
        }) {
          id
          email
        }
      }`
    });

    const invalidPasswordResponse = await api.post("", {
      query: `
      mutation {
        login(payload:{
          email:"${email}"
          password:"${faker.internet.password()}"
        }) {
          id
          email
        }
      }`
    });

    expect(invalidEmailResponse.data.errors[0].message).toBe(
      "Invalid credentials"
    );
    expect(invalidEmailResponse.headers.authorization).toBeUndefined();

    expect(invalidPasswordResponse.data.errors[0].message).toBe(
      "Invalid credentials"
    );
    expect(invalidPasswordResponse.headers.authorization).toBeUndefined();
  });

  test("find user by id", async () => {
    const { email, id, token } = await registerRandomUser();

    const { data } = await api.post(
      "",
      {
        query: `query {
        findUserById(id:"${id}"){
          id
          email
        }
      }`
      },
      {
        headers: {
          authorization: token
        }
      }
    );

    expect(data.data.findUserById.email).toBe(email);
  });

  test("fail to find user by id without authorization token", async () => {
    const { id } = await registerRandomUser();

    const { data } = await api.post("", {
      query: `query {
        findUserById(id:"${id}"){
          id
          email
        }
      }`
    });

    expect(data.errors[0].message).toBe("Unauthorized");
  });

  test("delete user", async () => {
    const { token } = await registerRandomUser();

    const { data } = await api.post(
      "",
      {
        query: `mutation {
        deleteUser
      }`
      },
      { headers: { authorization: token } }
    );

    expect(data.data.deleteUser).toBe(true);
  });

  test("fail to delete user without a valid authorization token", async () => {
    const { data } = await api.post(
      "",
      {
        query: `mutation {
          deleteUser
        }`
      },
      {
        headers: {
          authorization: faker.internet.password() /* random string */
        }
      }
    );

    expect(data.errors[0].message).toBe("Unauthorized");
  });
});
