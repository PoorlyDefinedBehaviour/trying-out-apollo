const loginMutation = (email: string, password: string) =>
  `mutation {
    login(
      payload: { email: "${email}", password: "${password}" }
    ) {
      id
      email
      createdAt
      updatedAt
    }
  }  
  `;

export default loginMutation;