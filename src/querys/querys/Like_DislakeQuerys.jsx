import { gql } from "@apollo/client";

export const Iliked = gql`
  query Iliked($id: ID!) {
    profiles(
      filters: { user: { id: { eq: $id } } }
      pagination: { start: 0, limit: -1 }
      sort: ["id:desc"]
    ) {
      data {
        attributes {
          likes {
            data {
              id
              attributes {
                createdAt
                user {
                  data {
                    attributes {
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
                            nombres_apellidos
                            edad
                            sexo
                            provincia
                            verificado
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
            }
          }
        }
      }
    }
  }
`;

export const cantidad_likes = gql`
  query cantidad_likes($id: ID!) {
    likes(
      filters: { profiles: { user: { id: { eq: $id } } } }
      pagination: { start: 0, limit: -1 }
      sort: ["id:desc"]
    ) {
      data {
        id
      }
    }
  }
`;
