import { gql } from "@apollo/client";

export const cantidad_mensajes = gql`
  query cantidad_mensajes($id: ID!) {
    messages(
      filters: { recipient: { id: { eq: $id } }, and: { read: { eq: false } } }
      pagination: { start: 0, limit: -1 }
      sort: ["createdAt:asc"]
    ) {
      data {
        id
      }
    }
  }
`;

export const PerfilesMensajes = gql`
  query GetUsersWhoMessagedMe($id: ID!) {
    usersPermissionsUsers(
      filters: { messages_sender: { recipient: { id: { eq: $id } } } }
      pagination: {}
      sort: ["messages:read:asc"]
    ) {
      data {
        id
        attributes {
          username
          profile {
            data {
              id
              attributes {
                nombres_apellidos
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
      }
    }
  }
`;

export const Converzacion = gql`
  query Converzacion($sender_id: ID!, $recipient_id: ID!) {
    messages(
      filters: {
        or: [
          {
            sender: { id: { eq: $sender_id } }
            and: { recipient: { id: { eq: $recipient_id } } }
          }
          {
            sender: { id: { eq: $recipient_id } }
            and: { recipient: { id: { eq: $sender_id } } }
          }
        ]
      }
      pagination: { start: 0, limit: -1 }
      sort: ["createdAt:desc"]
    ) {
      data {
        id
        attributes {
          sender {
            data {
              id
              attributes {
                username
                profile {
                  data {
                    id
                    attributes {
                      nombres_apellidos
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
            }
          }
          createdAt
          updatedAt
          message
        }
      }
    }
  }
`;
