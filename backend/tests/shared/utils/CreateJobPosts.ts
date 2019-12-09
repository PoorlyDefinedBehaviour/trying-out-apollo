import faker from "faker";
import api from "../../Api";
import createJobMutation from "../mutations/CreateJob.mutation";

export default async function createJobPosts(amount: number) {
  const jobs: Promise<any>[] = [];

  for (let i = 0; i < amount; ++i) {
    jobs.push(
      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          pay: faker.random.number(9999),
          state: "SP"
        })
      })
    );
  }

  const results = await Promise.all(jobs);
  const data = results.map(({ data }) => data);
  return data;
}
