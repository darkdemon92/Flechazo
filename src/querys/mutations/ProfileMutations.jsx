import { gql } from "@apollo/client";

export const MutationNewProfile = gql`
  mutation MutationNewProfile(
    $user_id: ID!
    $nombres_apellidos: String!
    $edad: Int!
    $provincia: String!
    $sexo: String!
  ) {
    createProfile(
      data: {
        user: $user_id
        nombres_apellidos: $nombres_apellidos
        edad: $edad
        provincia: $provincia
        sexo: $sexo
      }
    ) {
      data {
        id
      }
    }
  }
`;
