import faker from "faker";
import startServer from "../../src/Server";
import registerRandomUser from "../shared/utils/RegisterRandomUser";
import api from "../Api";
import createJobMutation from "../shared/mutations/CreateJob.mutation";
import findJobsByUserQuery from "../shared/queries/FindJobsByUser.query";
import findJobsByStateQuery from "../shared/queries/FindJobsByState.query";
import createJobPosts from "../shared/utils/CreateJobPosts";
import findJobsByCityQuery from "../shared/queries/FindJobsByCity.query";
import findJobsByJourneyQuery from "../shared/queries/FindJobsByJourney.query";
import findJobsByPayRangeQuery from "../shared/queries/FindJobsByPayRange.query";
import findJobsByTitleQuery from "../shared/queries/FindJobsByTitle.query";
import findJobsByRemoteStatus from "../shared/queries/FindJobsByRemoteStatus.query";

let apiServer;
beforeAll(async () => {
  const { server } = await startServer();
  apiServer = server;
});

afterAll(() => apiServer.close());

describe("Job resolver test suite", () => {
  test("create job post", async () => {
    const { id } = await registerRandomUser();

    const { data } = await api.post("", {
      query: createJobMutation({
        title: faker.random.alphaNumeric(10),
        description: faker.random.alphaNumeric(10),
        pay: faker.random.number(9999)
      })
    });

    expect(data.data.createJobPost.poster.id).toBe(id);
    expect(data.errors).toBeUndefined();
  });

  test("fail to create job post without being logged in", async () => {
    api.defaults.headers.Cookie = null;

    const { data } = await api.post("", {
      query: createJobMutation({
        title: faker.random.alphaNumeric(10),
        description: faker.random.alphaNumeric(10),
        pay: faker.random.number(9999)
      })
    });

    expect(data.errors[0].message).toBe("Unauthorized");
  });

  test("find all jobs by user", async () => {
    await registerRandomUser();

    await Promise.all([
      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          pay: faker.random.number(9999)
        })
      }),
      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          pay: faker.random.number(9999)
        })
      }),
      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          pay: faker.random.number(9999)
        })
      })
    ]);

    const { data } = await api.post("", { query: findJobsByUserQuery() });

    expect(data.data.findJobsByUser.length).toBe(3);
    expect(data.errors).toBeUndefined();
  });

  test("find jobs by state", async () => {
    await registerRandomUser();

    await createJobPosts(3);

    await api.post("", {
      query: createJobMutation({
        title: faker.random.alphaNumeric(10),
        description: faker.random.alphaNumeric(10),
        pay: faker.random.number(9999),
        state: "SC"
      })
    });

    const { data: queryOneData } = await api.post("", {
      query: findJobsByStateQuery("SC")
    });

    const { data: queryTwoData } = await api.post("", {
      query: findJobsByStateQuery("SP")
    });

    expect(
      queryOneData.data.findJobsByState.every(({ state }) => state === "SC")
    );
    expect(
      queryTwoData.data.findJobsByState.every(({ state }) => state === "SP")
    );
  });

  test("find jobs by city", async () => {
    await registerRandomUser();

    await createJobPosts(3);

    const city = faker.random.alphaNumeric(10);

    await api.post("", {
      query: createJobMutation({
        title: faker.random.alphaNumeric(10),
        description: faker.random.alphaNumeric(10),
        pay: faker.random.number(9999),
        city
      })
    });

    const { data } = await api.post("", {
      query: findJobsByCityQuery(city)
    });

    expect(data.data.findJobsByCity[0].city).toBe(city);
  });

  test("find jobs by journey", async () => {
    await registerRandomUser();

    const expectedJourney = "parttime";

    await Promise.all([
      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          pay: faker.random.number(9999),
          journey: expectedJourney
        })
      }),

      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          pay: faker.random.number(9999),
          journey: expectedJourney
        })
      })
    ]);

    const { data } = await api.post("", {
      query: findJobsByJourneyQuery(expectedJourney)
    });

    expect(
      data.data.findJobsByJourney.every(
        ({ journey }) => journey === expectedJourney
      )
    );
  });

  test("find jobs by pay range", async () => {
    await registerRandomUser();

    const minimum = 1000;
    const maximum = 2000;

    await Promise.all([
      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          pay: 7654
        })
      }),
      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          pay: 1500
        })
      }),
      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          pay: 1702
        })
      })
    ]);

    const { data } = await api.post("", {
      query: findJobsByPayRangeQuery(minimum, maximum)
    });

    expect(
      data.data.findJobsByPayRange.every(
        ({ pay }) => pay >= minimum && pay <= maximum
      )
    );
  });

  test("find only remote jobs", async () => {
    await registerRandomUser();

    await Promise.all([
      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          remote: true
        })
      }),
      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          remote: false
        })
      }),
      api.post("", {
        query: createJobMutation({
          title: faker.random.alphaNumeric(10),
          description: faker.random.alphaNumeric(10),
          remote: true
        })
      })
    ]);

    const { data } = await api.post("", {
      query: findJobsByRemoteStatus("true")
    });

    expect(data.data.findJobsByRemoteStatus.every(({ remote }) => remote));
  });

  test("find jobs by title", async () => {
    await registerRandomUser();

    await Promise.all([
      api.post("", {
        query: createJobMutation({
          title: "react dev",
          description: faker.random.alphaNumeric(10)
        })
      }),
      api.post("", {
        query: createJobMutation({
          title: "react native dev",
          description: faker.random.alphaNumeric(10)
        })
      }),
      api.post("", {
        query: createJobMutation({
          title: "php dev",
          description: faker.random.alphaNumeric(10)
        })
      })
    ]);

    const { data } = await api.post("", {
      query: findJobsByTitleQuery("react")
    });

    expect(
      data.data.findJobsByTitle.every(({ title }) => /react/gi.test(title))
    );
    expect(
      data.data.findJobsByTitle.every(({ title }) => !/php/gi.test(title))
    );
  });
});
