const deleteProjectByNameMutation = (name: string) => `
mutation {
  deleteProjectByName(name:"${name}")
}`;

export default deleteProjectByNameMutation;
