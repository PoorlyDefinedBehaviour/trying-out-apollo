interface CreateJobMutationArgs {
  title: string;
  description: string;
  pay?: number;
  city?: string;
  state?: string;
  journey?: string;
  remote?: boolean;
}

const createJobMutation = ({
  title,
  description,
  pay = 5000,
  state = "SP",
  city = "SOMECITY",
  journey = "fulltime",
  remote = false
}: CreateJobMutationArgs) =>
  `mutation {
    createJobPost(
      payload: {
        title: "${title}"
        description: "${description}"
        pay: ${pay}
        remote: ${remote}
        journey: "${journey}"
        state: "${state}"
        city: "${city}"
      }
    ) {
      id
      poster {
        id
        email
        jobs {
          id
        }
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

export default createJobMutation;
