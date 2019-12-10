import faker from "faker";
import registerUserMutation from "../shared/mutations/RegisterUser.mutation";
import startServer from "../../src/Server";
import loginMutation from "../shared/mutations/Login.mutation";
import registerRandomUser from "../shared/utils/RegisterRandomUser";
import logoutMutation from "../shared/mutations/Logout.mutation";
import api from "../Api";
import deleteAccountMutation from "../shared/mutations/DeleteAccount.mutation";

let apiServer;
beforeAll(async () => {
  const { server } = await startServer();
  apiServer = server;
});

afterAll(() => apiServer.close());

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

  test("fail to register user with bad email or password", async () => {
    const { data: invalidEmailData } = await api.post("", {
      query: registerUserMutation("bademail", faker.internet.password())
    });

    const { data: invalidPasswordData } = await api.post("", {
      query: registerUserMutation(faker.internet.email(), "123")
    });

    expect(
      invalidEmailData.errors[0].extensions.exception.validationErrors[0]
        .constraints.isEmail
    ).toBe("Email must be valid");
    expect(
      invalidPasswordData.errors[0].extensions.exception.validationErrors[0]
        .constraints.minLength
    ).toBe("Password needs to be at least 6 characters long");
  });

  test("login", async () => {
    const { id, email, password } = await registerRandomUser();

    const { data } = await api.post("", {
      query: loginMutation(email, password)
    });

    expect(data.data.login.id).toBe(id);
    expect(data.errors).toBeUndefined();
  });

  test("fail to login with invalid credentials", async () => {
    const { email, password } = await registerRandomUser();

    const { data: invalidEmailData } = await api.post("", {
      query: loginMutation("invalid", password)
    });

    const { data: invalidPasswordData } = await api.post("", {
      query: loginMutation(email, "invalid")
    });

    expect(
      invalidEmailData.errors[0].extensions.exception.validationErrors[0]
        .constraints.isEmail
    ).toBe("Email must be valid");
    expect(invalidPasswordData.errors[0].message).toBe("Invalid credentials");
  });

  test("logout", async () => {
    const { email, password } = await registerRandomUser();

    await api.post("", {
      query: loginMutation(email, password)
    });

    const { data } = await api.post("", {
      query: logoutMutation()
    });

    expect(data.data.logout).toBe(true);
    expect(data.errors).toBeUndefined();
  });


  test("delete account", async () => {
    await registerRandomUser();

    const { data } = await api.post("", {
      query: deleteAccountMutation()
    });

    expect(data.data.deleteAccount).toBe(true);
    expect(data.errors).toBeUndefined();
  });

  test("fail to delete account without being logged in", async () => {
    api.defaults.headers.Cookie = null;

    const { data } = await api.post("", {
      query: deleteAccountMutation()
    });

    expect(data.errors[0].message).toBe("Unauthorized");
  });
});
