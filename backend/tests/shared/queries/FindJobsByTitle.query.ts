const findJobsByTitleQuery = (title: string) =>
  `query {
    findJobsByTitle(title:"${title}") {
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

export default findJobsByTitleQuery;
