const findJobsByPayRangeQuery = (start: number, end: number) =>
  `query {
    findJobsByPayRange(start:${start}, end: ${end}) {
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
  }`;

export default findJobsByPayRangeQuery;
