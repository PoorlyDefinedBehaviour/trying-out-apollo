const findProjectByNameQuery = (name: string) => `
query {
  findProjectByName(name:"${name}"){
    id
    name
    owner{
      id
      email
    }
    todos{
      id
      description
      status
    }
  }
}`;

export default findProjectByNameQuery;
