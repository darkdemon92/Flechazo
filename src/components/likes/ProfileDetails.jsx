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
    return null;
  }
  const profileData = data?.profile?.data;
  const profileAttributes = profileData?.attributes;
  if (profileData && profileAttributes) {
    const avatarUrl = profileAttributes.avatar.data
      ? `${import.meta.env.VITE_BASE_URL}${
          profileAttributes.avatar.data?.attributes.url
        }`
      : profileAttributes.sexo === "Femenino"
      ? F
      : M;
    const fotos = profileAttributes.mis_fotos?.data;
    return (
      <div className={Plus && Plus.pluses === null ? "avatar" : "avatar_plus"}>
        <Typography component="h1" variant="h3" style={{ color: "blue" }}>
          Perfil de {profileAttributes.nombres_apellidos}
        </Typography>
        <img
          src={avatarUrl}
          alt="Avatar"
          style={{ maxWidth: "300px", padding: "5px", borderRadius: "20px" }}
        />
        <Typography component="h1" variant="h4">
          Nombres y Apellidos: {profileAttributes.nombres_apellidos}
        </Typography>
        <Typography component="h1" variant="h4">
          Edad: {profileAttributes.edad}
        </Typography>
        <Typography component="h1" variant="h4">
          Sexo: {profileAttributes.sexo}
        </Typography>
        <Typography component="h1" variant="h4">
          Provincia: {profileAttributes.provincia}
        </Typography>
        <Typography component="h1" variant="h4">
          {profileAttributes.verificado ? (
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
          Fotos de {profileAttributes.nombres_apellidos}
        </Typography>
        <ImageList
          sx={{ width: "100%", height: "100%" }}
          cols={3}
          rowHeight="auto"
        >
          {fotos?.length > 0 ? (
            fotos?.map((fotos) => (
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
