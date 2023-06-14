import { gql } from "@apollo/client";

export const createLicenciasDeObra = gql`
  mutation createLicenciasDeObra(
    $username: String!
    $n_de_radicacion: String!
    $solicitante_nombres_apellidos: String!
    $solicitante_ci: String!
    $dia: Int!
    $mes: Int!
    $year: Long!
    $tipo: String!
    $tipologia: String!
    $estado: ID!
  ) {
    createLicenciasDeObra(
      data: {
        municipio: $username
        n_de_radicacion: $n_de_radicacion
        solicitante_nombres_apellidos: $solicitante_nombres_apellidos
        solicitante_ci: $solicitante_ci
        dia: $dia
        mes: $mes
        year: $year
        tipo: $tipo
        tipologia: $tipologia
        estado: $estado
      }
    ) {
      data {
        id
      }
    }
  }
`;
