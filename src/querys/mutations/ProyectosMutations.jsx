import { gql } from "@apollo/client";

export const createRevDeProyecto = gql`
  mutation createRevDeProyecto(
    $num_radic_licencia: ID!
    $dia: Int!
    $mes: Int!
    $year: Long!
  ) {
    createRevDeProyecto(
      data: {
        licencias_de_obra: $num_radic_licencia
        dia: $dia
        mes: $mes
        year: $year
      }
    ) {
      data {
        id
      }
    }
  }
`;

export const EditarEstado = gql`
  mutation EditarEstado($id: ID!, $estado: ID! ) {
    updateLicenciasDeObra(id: $id, data: { estado: $estado }) {
      data {
        id
      }
    }
  }
`;
