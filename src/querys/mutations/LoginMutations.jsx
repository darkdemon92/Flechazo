import { gql } from "@apollo/client";

export const MutationLogin = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    login(input: { identifier: $username, password: $password }) {
      jwt
      user {
        id
        username
        confirmed
      }
    }
  }
`;
