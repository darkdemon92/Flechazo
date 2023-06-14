import { gql } from "@apollo/client";

export const GetLicencias = gql`
  query GetLicencias {
    licenciasDeObras(pagination: { start: 0, limit: -1 }, sort: "id:DESC") {
      data {
        id
        attributes {
          municipio
          n_de_radicacion
          solicitante_nombres_apellidos
          solicitante_ci
          dia
          mes
          year
          tipo
          tipologia
          estado {
            data {
              attributes {
                estado
              }
            }
          }
        }
      }
    }
  }
`;

export const GetLicenciasCierre = gql`
  query GetLicenciasCierre {
    licenciasCierres(pagination: { start: 0, limit: -1 }, sort: "id:DESC") {
      data {
        id
        attributes {
          municipio
          municipio_mes_year
          mes
          year
          lic_radicadas
          lic_aprobadas
          lic_no_aprobadas
          rev_lic_radicadas
          rev_lic_aprobadas
          rev_lic_no_aprobadas
        }
      }
    }
    licenciasCierreAcumulados(pagination: { start: 0, limit: -1 }, sort: "id:DESC") {
      data {
        id
        attributes {
          municipio
          lic_radicadas
          lic_aprobadas
          lic_no_aprobadas
          lic_pend_termino
          lic_pend_fuera_termino
          lic_pend_totales
          rev_lic_radicadas
          rev_lic_aprobadas
          rev_lic_no_aprobadas
          rev_lic_pend_termino
          rev_lic_pend_fuera_termino
          rev_lic_pend_totales
        }
      }
    }
  }
`;
