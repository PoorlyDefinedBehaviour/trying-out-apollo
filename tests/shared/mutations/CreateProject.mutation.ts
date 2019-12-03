const createProjectMutation = (name: string) =>
  `mutation {
    createProject(payload:{
      name:"${name}"
    }) {
      id
      name
      owner{
        id
        email
      }
    }
  }`;

export default createProjectMutation;
