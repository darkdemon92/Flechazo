import { gql } from "@apollo/client";

export const IsPlus = gql`
  query IsPlus {
    pluses {
      data {
        id
      }
    }
  }
`;
