const findJobsByCityQuery = (city: string) =>
  `query {
  findJobsByCity(payload:{
    value:"${city}"
  }) {
    id
    poster {
      id
      email
    }
    title
    description
    journey
    pay
    remote
    state
    city
  }
}
`;

export default findJobsByCityQuery;
