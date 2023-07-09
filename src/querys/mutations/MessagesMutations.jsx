import { gql } from "@apollo/client";

export const SendMensaje = gql`
  mutation SendMensaje($user_id: ID!, $destinatario: ID!, $mensaje: String!) {
    createMessage(
      data: { sender: $user_id, recipient: $destinatario, message: $mensaje }
    ) {
      data {
        id
      }
    }
  }
`;
