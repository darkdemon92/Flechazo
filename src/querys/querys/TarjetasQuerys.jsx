import { gql } from "@apollo/client";
export const GetProfiles = gql`
  query GetProfiles($id: ID!, $provincia: String, $sexo: String) {
    profiles(
      filters: {
        user: { id: { not: { eq: $id } } }
        and: [
          { or: [{ provincia: { eq: $provincia } }] }
          { or: [{ sexo: { eq: $sexo } }] }
          {
            or: [
              { dislikes: { user: { id: { not: { eq: $id } } } } }
              { dislikes: { user: { id: { eq: null } } } }
            ]
          }
          {
            or: [
              { likes: { user: { id: { not: { eq: $id } } } } }
              { likes: { user: { id: { eq: null } } } }
            ]
          }
        ]
      }
      pagination: { start: 0, limit: 10 } #limit -1
      sort: ["id:desc"]
    ) {
      data {
        id
        attributes {
          nombres_apellidos
          edad
          provincia
          sexo
          verificado
          avatar {
            data {
              id
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;
