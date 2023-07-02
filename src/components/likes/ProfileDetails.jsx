import "./Likes.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Typography from "@mui/material/Typography";
import { GetProfileDetails } from "../../querys/querys/ProfileQuerys";
import { useAlertStore } from "../../store/Store";
import Loadding from "../../helpers/Loadding";
import F from "../../assets/F.webp";
import M from "../../assets/M.webp";
import DoNotDisturbSharpIcon from "@mui/icons-material/DoNotDisturbSharp";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import VerifiedSharpIcon from "@mui/icons-material/VerifiedSharp";

function ProfileDetails({ Plus }) {
  const { id } = useParams();
  //console.log(id);
  const {
    ChangeMsgOpen,
    ChangeSeverity,
    ChangeMsg,
    ChangeDuration,
    ChangePositionV,
    ChangePositionH,
  } = useAlertStore();
  const { loading, error, data } = useQuery(GetProfileDetails, {
    variables: { id: id },
  });

  //console.log(data);
  if (loading) {
    return <Loadding />;
  }
  if (error) {
    ChangeMsgOpen(true);
    ChangeSeverity("error");
    ChangeMsg(
      error.message === "Failed to fetch"
        ? "Error al hacer la petición al Servidor!"
        : error.message
    );
    ChangeDuration(2000);
    ChangePositionV("top");
    ChangePositionH("center");
  }
  if (data && data?.profile?.data) {
    //console.log(data);
    return (
      <div className={Plus.error ? "avatar" : "avatar_plus"}>
        <Typography component="h1" variant="h3" style={{ color: "blue" }}>
          Perfil de {data.profile.data.attributes.nombres_apellidos}
        </Typography>
        <img
          src={
            data.profile.data.attributes.avatar.data
              ? `${import.meta.env.VITE_BASE_URL}${
                  data.profile.data.attributes.avatar.data?.attributes.url
                }`
              : data.profile.data.attributes.sexo === "Femenino"
              ? F
              : M
          }
          alt="Avatar"
          style={{ maxWidth: "300px", padding: "5px", borderRadius: "20px" }}
        />
        <Typography component="h1" variant="h4">
          Nombres y Apellidos: {data.profile.data.attributes.nombres_apellidos}
        </Typography>
        <Typography component="h1" variant="h4">
          Edad: {data.profile.data.attributes.edad}
        </Typography>
        <Typography component="h1" variant="h4">
          Sexo: {data.profile.data.attributes.sexo}
        </Typography>
        <Typography component="h1" variant="h4">
          Provincia: {data.profile.data.attributes.provincia}
        </Typography>
        <Typography component="h1" variant="h4">
          {data?.profile?.data?.attributes?.verificado ? (
            <>
              Verificado:{" "}
              <VerifiedSharpIcon
                fontSize="large"
                style={{ color: "blueviolet" }}
              />
            </>
          ) : (
            <>
              Verificado: <DoNotDisturbSharpIcon fontSize="large" />
            </>
          )}
        </Typography>
        <br /> <br /> <br />
        <Typography component="h1" variant="h4" style={{ color: "gray" }}>
          Fotos de {data.profile.data.attributes.nombres_apellidos}
        </Typography>
        <ImageList
          sx={{ width: "100%", height: "100%" }}
          cols={3}
          rowHeight="auto"
        >
          {data.profile.data.attributes.mis_fotos?.data?.length > 0 ? (
            data.profile.data.attributes.mis_fotos?.data.map((fotos) => (
              <ImageListItem key={fotos.id}>
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${
                    fotos.attributes.url
                  }?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${import.meta.env.VITE_BASE_URL}${
                    fotos.attributes.url
                  }?w=164&h=164&fit=crop&auto=format`}
                  alt="Foto"
                  loading="lazy"
                  //onClick={handleClick}
                  style={{
                    maxWidth: "auto",
                    height: "auto",
                    padding: "5px",
                    borderRadius: "20px",
                    position: "relative",
                    zIndex: 1,
                    //cursor: "pointer",
                  }}
                />
              </ImageListItem>
            ))
          ) : (
            <Typography component="h1" variant="h3" style={{ color: "red" }}>
              <DoNotDisturbSharpIcon fontSize="large" /> Sin Fotos
            </Typography>
          )}
        </ImageList>
      </div>
    );
  } else {
    return (
      <Typography component="h1" variant="h3" style={{ color: "red" }}>
        <DoNotDisturbSharpIcon fontSize="large" /> Este Usuario aún no
        completado su perfil...
      </Typography>
    );
  }
}

export default ProfileDetails;
