import faker from "faker";
import registerUserMutation from "../mutations/RegisterUser.mutation";
import api from "../../Api";

export default async function registerRandomUser() {
  const email = faker.internet.email();
  const password = faker.internet.password();

  api.defaults.headers.Cookie = null;

  const response = await api.post("", {
    query: registerUserMutation(email, password)
  });

  const id = response.data.data.registerUser.id;
  const token = response.headers.authorization;
  const [cookie] = response.headers["set-cookie"];

  api.defaults.headers.Cookie = cookie;
  api.defaults.withCredentials = true;

  return { email, password, id, token, cookie };
}
