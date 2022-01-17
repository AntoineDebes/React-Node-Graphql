import { gql, useMutation } from "@apollo/client";

const REGISTER_USER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }
`;

export const useRegister = () => {
  const [register] = useMutation(REGISTER_USER);
};
