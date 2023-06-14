import { gql } from "@apollo/client";

export const MutationRegister = gql`
  mutation RegisterMutation(
    $username: String!
    $email: String!
    $password: String!
  ) {
    register(
      input: { username: $username, email: $email, password: $password }
    ) {
      jwt
      user {
        id
        username
      }
    }
  }
`;
