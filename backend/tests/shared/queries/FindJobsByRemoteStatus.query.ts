const findJobsByRemoteStatus = (remote: string) =>
  `query {
    findJobsByRemoteStatus(payload:{
      value: "${remote}"
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

export default findJobsByRemoteStatus;
