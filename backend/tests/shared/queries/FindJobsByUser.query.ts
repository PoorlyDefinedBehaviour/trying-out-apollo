const findJobsByUserQuery = () => `
query {
  findJobsByUser {
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

export default findJobsByUserQuery;