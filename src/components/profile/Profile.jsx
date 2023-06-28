import { useEffect } from "preact/hooks";
import { signal } from "@preact/signals";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { GetProfile } from "../../querys/querys/ProfileQuerys";
import { useAlertStore } from "../../store/Store";
import Loadding from "../../helpers/Loadding";
import F from "../../assets/F.webp";
import M from "../../assets/M.webp";
import { IconButton } from "@mui/material";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import ChangeCircleSharpIcon from "@mui/icons-material/ChangeCircleSharp";
import DoNotDisturbSharpIcon from "@mui/icons-material/DoNotDisturbSharp";
import AddPhotoAlternateSharpIcon from "@mui/icons-material/AddPhotoAlternateSharp";
import Edit from "./Edit";
import UploadAvatar from "./UploadAvatar";
import UploadFoto from "./UploadFoto";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const modalStatus = signal(false);
const modal2Status = signal(false);
const modal3Status = signal(false);

function Profile({ user_id }) {
  //console.log("render profile");
  //console.log(user_id);
  let navigate = useNavigate();
  const {
    ChangeMsgOpen,
    ChangeSeverity,
    ChangeMsg,
    ChangeDuration,
    ChangePositionV,
    ChangePositionH,
  } = useAlertStore();
  const { loading, error, data, refetch } = useQuery(GetProfile, {
    variables: { id: user_id },
  });
  useEffect(() => {
    //console.log("refetch");
    refetch();
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
  if (data && data.profiles.data.length > 0) {
    //console.log(data);
    return (
      <>
        <Typography component="h1" variant="h3" style={{ color: "blue" }}>
          Mi Perfil
          <IconButton
            onClick={() => (modalStatus.value = true)}
            style={{ color: "green" }}
          >
            <EditSharpIcon fontSize="large" />
          </IconButton>
        </Typography>{" "}
        <Edit
          modalStatus={modalStatus}
          data={data.profiles.data[0]}
          refetch={refetch}
        />
        <UploadAvatar
          modal2Status={modal2Status}
          data={data.profiles.data[0]}
          refetch={refetch}
        />
        <UploadFoto
          modal3Status={modal3Status}
          data={data.profiles.data[0]}
          refetch={refetch}
        />
        <br />
        <img
          src={
            data.profiles.data[0].attributes.avatar.data
              ? `${import.meta.env.VITE_BASE_URL}${
                  data.profiles.data[0].attributes.avatar.data?.attributes.url
                }`
              : data.profiles.data[0].attributes.sexo === "Femenino"
              ? F
              : M
          }
          alt="Avatar"
          style={{ maxWidth: "300px", padding: "5px", borderRadius: "20px" }}
        />
        <IconButton
          onClick={() => (modal2Status.value = true)}
          style={{ color: "green" }}
        >
          <ChangeCircleSharpIcon fontSize="large" />
        </IconButton>
        <Typography component="h1" variant="h4">
          Nombres y Apellidos:{" "}
          {data.profiles.data[0].attributes.nombres_apellidos}
        </Typography>
        <Typography component="h1" variant="h4">
          Edad: {data.profiles.data[0].attributes.edad}
        </Typography>
        <Typography component="h1" variant="h4">
          Sexo: {data.profiles.data[0].attributes.sexo}
        </Typography>
        <Typography component="h1" variant="h4">
          Provincia: {data.profiles.data[0].attributes.provincia}
        </Typography>
        <br /> <br /> <br />
        <Typography component="h1" variant="h4" style={{ color: "gray" }}>
          Mis Fotos
          <IconButton
            onClick={() => (modal3Status.value = true)}
            style={{ color: "green" }}
          >
            <AddPhotoAlternateSharpIcon fontSize="large" />
          </IconButton>
        </Typography>
        <ImageList
          sx={{ width: "100%", height: "100%" }}
          cols={3}
          rowHeight="auto"
        >
          {data.profiles.data[0].attributes.mis_fotos?.data?.length > 0 ? (
            data.profiles.data[0].attributes.mis_fotos?.data.map((fotos) => (
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
      </>
    );
  }
  if (data && data.profiles.data.length === 0) {
    navigate("/profile/create", { replace: true });
  }
}

export default Profile;
