const findJobsByJourneyQuery = (journey: string) =>
  `query {
    findJobsByJourney(payload:{
      value:"${journey}"
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
  }`;

export default findJobsByJourneyQuery;
