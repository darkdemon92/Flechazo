import { gql } from "@apollo/client";

export const Liked = gql`
  mutation Liked($id: ID!, $profile: [ID!]!) {
    createLike(data: { user: $id, profiles: $profile }) {
      data {
        id
      }
    }
  }
`;

export const Disliked = gql`
  mutation Disliked($id: ID!, $profile: [ID!]!) {
    createDislike(data: { user: $id, profiles: $profile }) {
      data {
        id
      }
    }
  }
`;
