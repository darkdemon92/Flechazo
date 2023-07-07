import { gql } from "@apollo/client";

export const cantidad_mensajes = gql`
  query cantidad_mensajes($id: ID!) {
    messages(
      filters: {
        profile: { user: { id: { eq: $id } } }
        # and: { leido: { eq: false } }
      }
      pagination: { start: 0, limit: -1 }
      sort: ["createdAt:asc"]
    ) {
      data {
        id
      }
    }
  }
`;

export const id_profile_emisor = gql`
  query id_profile_emisor($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          profile {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const PerfilesMensajes = gql`
  query PerfilesMensajesSinLeer($id: ID!) {
    usersPermissionsUsers(
      filters: {
        messages: { profile: { user: { id: { eq: $id } } } }
        # and: { messages: { leido: { eq: false } } }
      }
      pagination: { start: 0, limit: -1 }
      sort: ["createdAt:asc"]
    ) {
      data {
        id
        attributes {
          profile {
            data {
              id
              attributes {
                nombres_apellidos
                avatar {
                  data {
                    attributes {
                      url
                    }
                  }
                }
                user {
                  data {
                    id
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

export const Converzacion = gql`
  query Converzacion(
    $emisor_user_id: ID!
    $receptor_user_id: ID!
    $emisor_profile_id: ID!
    $receptor_profile_id: ID!
  ) {
    messages(
      filters: {
        or: [
          {
            user: { id: { eq: $emisor_user_id } }
            and: { profile: { id: { eq: $receptor_profile_id } } }
          }
          {
            profile: { id: { eq: $emisor_profile_id } }
            and: { user: { id: { eq: $receptor_user_id } } }
          }
        ]
      }
      pagination: { start: 0, limit: -1 }
      sort: ["createdAt:desc"]
    ) {
      data {
        id
        attributes {
          user {
            data {
              id
              attributes {
                username
              }
            }
          }
          profile {
            data {
              id
              attributes {
                avatar {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
          createdAt
          updatedAt
          mensaje
        }
      }
    }
  }
`;
