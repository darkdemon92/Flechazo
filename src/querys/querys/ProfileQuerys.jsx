import { gql } from "@apollo/client";

export const GetProfile = gql`
query GetProfile($id: ID!) {
  profiles(filters: { user: { id: { eq: $id } } }) {
    data {
      id
      attributes {
        avatar {
          data {
            id
            attributes {
              url
            }
          }
        }
        nombres_apellidos
        edad
        sexo
        provincia
      }
    }
  }
}
`;