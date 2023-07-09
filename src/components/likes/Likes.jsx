import { useState } from "preact/hooks";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Typography from "@mui/material/Typography";
import "./Likes.css";
import { useAlertStore } from "../../store/Store";
import { useQuery } from "@apollo/client";
import { Iliked } from "../../querys/querys/Like_DislakeQuerys";
import Loadding from "../../helpers/Loadding";
import F from "../../assets/F.webp";
import M from "../../assets/M.webp";
import IconButton from "@mui/material/IconButton";
import AssignmentIndSharpIcon from "@mui/icons-material/AssignmentIndSharp";
import CommentSharpIcon from "@mui/icons-material/CommentSharp";
import ControlPointSharpIcon from "@mui/icons-material/ControlPointSharp";
import VerifiedSharpIcon from "@mui/icons-material/VerifiedSharp";
import { useNavigate } from "react-router-dom";
import SendMessage from "./SendMessage";

export default function Likes({ Plus, user_id }) {
  const [openmsg, setOpenmsg] = useState(false);
  const [destinatario, setDestinatario] = useState("");
  let navigate = useNavigate();
  const {
    ChangeMsgOpen,
    ChangeSeverity,
    ChangeMsg,
    ChangeDuration,
    ChangePositionV,
    ChangePositionH,
  } = useAlertStore();
  const Existe_Mensaje = async ({ profile_id }) => {
    //console.log(profile_id);
    setDestinatario(profile_id);
    setOpenmsg(true);
  };
  const { loading, error, data, refetch } = useQuery(Iliked, {
    variables: { id: user_id },
  });
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
  if (data) {
    //console.log(data.profiles.data[0].attributes.likes.data);
    const { profiles } = data;
    return (
      <>
        {Plus && Plus.pluses === null ? (
          <Typography
            component="h1"
            variant="h6"
            style={{ marginTop: "5px", color: "red" }}
          >
            Funcionalidad solo para Usuarios Plus
            <ControlPointSharpIcon
              style={{ color: "blue" }}
              fontSize="medium"
            />{" "}
          </Typography>
        ) : (
          <Typography
            component="h1"
            variant="h4"
            style={{ marginTop: "5px", color: "blue" }}
          >
            Le Gustaste A:
          </Typography>
        )}

        <ImageList
          sx={{ width: "100%", height: "100%" }}
          cols={2}
          rowHeight="auto"
        >
          <SendMessage
            openmsg={openmsg}
            setOpenmsg={setOpenmsg}
            user_id={user_id}
            destinatario={destinatario}
          />
          {profiles.data[0].attributes.likes.data.map((likes) => {
            const ProfileData =
              likes?.attributes.user.data.attributes.profile.data;
            const ProfileAtrributes = ProfileData?.attributes;
            const AvatarUrl = ProfileAtrributes?.avatar?.data?.attributes?.url;
            return (
              <ImageListItem
                className={
                  Plus && Plus.pluses === null ? "avatar" : "avatar_plus"
                }
                key={likes.id}
              >
                <img
                  src={
                    AvatarUrl
                      ? `${import.meta.env.VITE_BASE_URL}${AvatarUrl}`
                      : ProfileAtrributes.sexo === "Femenino"
                      ? F
                      : M
                  }
                  alt="Avatar"
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
                {ProfileAtrributes?.verificado ? (
                  <VerifiedSharpIcon className="verified" fontSize="large" />
                ) : (
                  <></>
                )}
                <ImageListItemBar
                  title={
                    <>
                      Nombres y Apellidos:{" "}
                      {ProfileAtrributes?.nombres_apellidos}
                    </>
                  }
                  subtitle={
                    <>
                      Edad: {ProfileAtrributes?.edad}
                      <br />
                      Sexo: {ProfileAtrributes?.sexo}
                      <br />
                      Provincia: {ProfileAtrributes?.provincia}
                      <br />
                      Fecha en que le gustaste:{" "}
                      {new Date(
                        likes?.attributes?.createdAt
                      ).toLocaleDateString()}{" "}
                      {new Date(
                        likes?.attributes?.createdAt
                      ).toLocaleTimeString()}
                      <br />
                      Ver Perfil:
                      {
                        <IconButton
                          aria-label="Ver Perfil"
                          onClick={() =>
                            navigate(`/profile/${ProfileData?.id}`, {
                              replace: true,
                            })
                          }
                        >
                          <AssignmentIndSharpIcon
                            fontSize="medium"
                            style={{ color: "blue" }}
                          />
                        </IconButton>
                      }{" "}
                      Enviar Mensaje:
                      {
                        <IconButton
                          aria-label="Enviar Mensaje"
                          onClick={() => {
                            Existe_Mensaje({
                              profile_id: ProfileData?.attributes.user?.data?.id,
                            });
                          }}
                        >
                          <CommentSharpIcon
                            fontSize="medium"
                            style={{ color: "gray" }}
                          />
                        </IconButton>
                      }
                    </>
                  }
                  position="below"
                />
              </ImageListItem>
            );
          })}
        </ImageList>
      </>
    );
  }
}
