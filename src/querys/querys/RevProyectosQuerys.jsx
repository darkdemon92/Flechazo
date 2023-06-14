import { gql } from "@apollo/client";

export const GetRevDeProyectos = gql`
  query revDeProyectos {
    revDeProyectos(pagination: { start: 0, limit: -1 }, sort: "id:DESC") {
      data {
        id
        attributes {
          licencias_de_obra {
            data {
              id
              attributes {
                municipio
                n_de_radicacion
                solicitante_nombres_apellidos
                solicitante_ci
                tipo
                tipologia
                estado {
                  data {
                    id
                    attributes {
                      estado
                    }
                  }
                }
              }
            }
          }
          dia
          mes
          year
        }
      }
    }
  }
`;

export const GetNumRadicacionSinAprobar = gql`
  query GetNumRadicacionSinAprobar {
    licenciasDeObras(
      filters: {
        estado: { estado: { eq: "Pendiente" } }
        rev_de_proyecto: { id: { eq: null } }
      }
      pagination: { start: 0, limit: -1 }
      sort: "id:DESC"
    ) {
      data {
        id
        attributes {
          n_de_radicacion
        }
      }
    }
  }
`;

