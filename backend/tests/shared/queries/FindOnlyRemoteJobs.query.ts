const findOnlyRemoteJobsQuery = () =>
  `query {
    findOnlyRemoteJobs {
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

export default findOnlyRemoteJobsQuery;
