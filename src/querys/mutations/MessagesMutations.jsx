import { gql } from "@apollo/client";

export const SendMensaje = gql`
  mutation SendMensaje($user_id: ID!, $destinatario: ID!, $mensaje: String!) {
    createMessage(
      data: { user: $user_id, profile: $destinatario, mensaje: $mensaje }
    ) {
      data {
        id
      }
    }
  }
`;
