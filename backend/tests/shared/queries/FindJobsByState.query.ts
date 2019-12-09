const findJobsByStateQuery = (state: string) =>
  `query {
  findJobsByState(state:"${state}") {
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

export default findJobsByStateQuery;