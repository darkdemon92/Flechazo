import { gql } from "@apollo/client";

export const MutationNewProfile = gql`
  mutation NewProfile(
    $user_id: ID!
    $nombres_apellidos: String!
    $edad: Int!
    $provincia: String!
    $sexo: String!
  ) {
    createProfile(
      data: {
        user: $user_id
        nombres_apellidos: $nombres_apellidos
        edad: $edad
        provincia: $provincia
        sexo: $sexo
      }
    ) {
      data {
        id
      }
    }
  }
`;

export const MutationUpdateProfile = gql`
  mutation UpdateProfile(
    $id: ID!
    $nombres_apellidos: String
    $edad: Int
    $provincia: String
    $sexo: String
    $avatar: ID
    $foto: [ID]
  ) {
    updateProfile(
      id: $id
      data: {
        nombres_apellidos: $nombres_apellidos
        edad: $edad
        provincia: $provincia
        sexo: $sexo
        avatar: $avatar
        mis_fotos: $foto
      }
    ) {
      data {
        id
        attributes {
          nombres_apellidos
        }
      }
    }
  }
`;

export const MutationUploadImg = gql`
  mutation UploadImg($file: Upload!) {
    upload(file: $file) {
      data {
        id
      }
    }
  }
`;

//Varias Imágenes
export const MutationUploadImgs = gql`
mutation UploadImgs($files: [Upload!]!) {
  multipleUpload(files: $files) {
    data {
      id
    }
  }
}
`;

export const MutationDeleteImg = gql`
  mutation DeleteImg($id: ID!) {
    deleteUploadFile(id: $id) {
      data {
        id
      }
    }
  }
`;
