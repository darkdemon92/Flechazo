import { useState, useEffect } from "preact/hooks";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Typography from "@mui/material/Typography";
import "./Likes.css";
import { toast } from "sonner";
import F from "../../assets/F.webp";
import M from "../../assets/M.webp";
import IconButton from "@mui/material/IconButton";
import AssignmentIndSharpIcon from "@mui/icons-material/AssignmentIndSharp";
import CommentSharpIcon from "@mui/icons-material/CommentSharp";
import ControlPointSharpIcon from "@mui/icons-material/ControlPointSharp";
import VerifiedSharpIcon from "@mui/icons-material/VerifiedSharp";
import { useNavigate } from "react-router-dom";
import PocketBase from "pocketbase";
import SendMessage from "./SendMessage";

export default function Likes({ Plus, user_id, profile_id }) {
  //console.log("RENDER LIKES");
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);
  const [openmsg, setOpenmsg] = useState(false);
  const [msg_enviado, setMsg_enviado] = useState("");
  const [destinatario, setDestinatario] = useState("");
  let navigate = useNavigate();
  const Existe_Mensaje = async ({ destinatario_id }) => {
    //console.log(profile_id, message_me);
    setDestinatario(destinatario_id);
    setOpenmsg(true);
  };
  const [data, setData] = useState("");

  if (profile_id) {
    useEffect(async () => {
      try {
        const data = await pb.collection("users").getFullList({
          sort: "-created",
          filter: `id!="${user_id}" && like_me~"${profile_id}"`,
          expand: "profile, profile.avatar",
        });
        setData(data);
      } catch (error) {
        toast.error(error.message);
      }
    }, [msg_enviado]);
    //console.log(data);
  }

  if (data && data.length > 0) {
    return (
      <>
        {!Plus ? (
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
            setMsg_enviado={setMsg_enviado}
            user_id={user_id}
            destinatario={destinatario}
          />
          {data.map((user) => {
            const ProfileData = user.expand.profile;
            const Avatar = ProfileData.expand.avatar;
            return (
              <ImageListItem
                className={!Plus ? "avatar" : "avatar_plus"}
                key={user.id}
              >
                <img
                  src={
                    Avatar
                      ? `${import.meta.env.VITE_BASE_URL}/api/files/avatars/${
                          Avatar.id
                        }/${Avatar.avatar}`
                      : ProfileData.sexo === "Femenino"
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
                {ProfileData?.verificado ? (
                  <VerifiedSharpIcon className="verified" fontSize="large" />
                ) : (
                  <></>
                )}
                <ImageListItemBar
                  title={
                    <>Nombres y Apellidos: {ProfileData?.nombres_apellidos}</>
                  }
                  subtitle={
                    <>
                      Edad: {ProfileData?.edad}
                      <br />
                      Sexo: {ProfileData?.sexo}
                      <br />
                      Provincia: {ProfileData?.provincia}
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
                      }
                      <br />
                      Enviar Mensaje:
                      {
                        <IconButton
                          aria-label="Enviar Mensaje"
                          onClick={() => {Existe_Mensaje({
                            destinatario_id:
                              ProfileData.id,
                          });}}
                        >
                          <CommentSharpIcon
                            fontSize="medium"
                            style={{ color: "gray" }}
                          />
                        </IconButton>
                      }{" "}
                      <br />
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
