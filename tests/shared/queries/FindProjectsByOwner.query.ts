const findProjectsByOwnerQuery = () => `
query {
  findProjectsByOwner{
    id
    name
    todos{
      id
      description
      status
    }
  }
}`;

export default findProjectsByOwnerQuery;
