import faker from "faker";
import registerUserMutation from "../mutations/RegisterUser.mutation";
import api from "../../Api";

export default async function registerRandomUser() {
  const email = faker.internet.email();
  const password = faker.internet.password();

  const response = await api.post("", {
    query: registerUserMutation(email, password)
  });

  const id = response.data.data.registerUser.id;
  const token = response.headers.authorization;

  return { email, password, id, token };
}
