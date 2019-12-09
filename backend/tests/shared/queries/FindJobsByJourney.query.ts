const findJobsByJourneyQuery = (journey: string) =>
  `query {
    findJobsByJourney(journey:"${journey}") {
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
