const findJobsByCityQuery = (city: string) =>
  `query {
  findJobsByCity(city:"${city}") {
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
