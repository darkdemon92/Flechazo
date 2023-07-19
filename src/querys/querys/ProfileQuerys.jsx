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
                previewUrl
              }
            }
          }
          mis_fotos(pagination: { start: 0, limit: -1 }, sort: ["id:desc"]) {
            data {
              id
              attributes {
                url
                previewUrl
              }
            }
          }
          nombres_apellidos
          edad
          sexo
          provincia
          verificado
          user {
            data {
              attributes {
                role {
                  data {
                    attributes {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GetProfileDetails = gql`
  query GetProfileDetails($id: ID!) {
    profile(id: $id) {
      data {
        id
        attributes {
          avatar {
            data {
              id
              attributes {
                url
                previewUrl
              }
            }
          }
          mis_fotos(pagination: { start: 0, limit: -1 }, sort: ["id:desc"]) {
            data {
              id
              attributes {
                url
                previewUrl
              }
            }
          }
          nombres_apellidos
          edad
          sexo
          provincia
          verificado
        }
      }
    }
  }
`;
