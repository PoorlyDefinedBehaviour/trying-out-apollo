const registerUserMutation = (email: string, password: string) =>
  `mutation {
    registerUser(
      payload: { email: "${email}", password: "${password}" }
    ) {
      id
      email
    }
  }  
  `;

export default registerUserMutation;