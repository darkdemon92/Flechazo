import Avatar from "@mui/material/Avatar";
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

export default function Likes({ Plus, user_id }) {
  let navigate = useNavigate();
  const {
    ChangeMsgOpen,
    ChangeSeverity,
    ChangeMsg,
    ChangeDuration,
    ChangePositionV,
    ChangePositionH,
  } = useAlertStore();
  const { loading, error, data, refetch} = useQuery(Iliked, {
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
    return (
      <>
        {Plus.error ? (
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
          {data.profiles.data[0].attributes.likes.data.map((likes) => (
            <ImageListItem
              className={Plus.error ? "avatar" : "avatar_plus"}
              key={likes.id}
            >
              <img
                src={
                  likes?.attributes?.user?.data?.attributes?.profile?.data
                    ?.attributes?.avatar?.data?.attributes?.url
                    ? `${import.meta.env.VITE_BASE_URL}${
                        likes?.attributes?.user?.data?.attributes?.profile?.data
                          ?.attributes?.avatar?.data?.attributes?.url
                      }`
                    : likes?.attributes?.user?.data?.attributes?.profile?.data
                        ?.attributes?.avatar?.data?.attributes?.sexo ===
                      "Femenino"
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
              {likes?.attributes?.user?.data?.attributes?.profile?.data
                ?.attributes?.verificado ? (
                <VerifiedSharpIcon className="verified" fontSize="large" />
              ) : (
                <></>
              )}
              <ImageListItemBar
                title={
                  <>
                    Nombres y Apellidos:{" "}
                    {
                      likes?.attributes?.user?.data?.attributes?.profile?.data
                        ?.attributes?.nombres_apellidos
                    }
                  </>
                }
                subtitle={
                  <>
                    Edad:{" "}
                    {
                      likes?.attributes?.user?.data?.attributes?.profile?.data
                        ?.attributes?.edad
                    }
                    <br />
                    Sexo:{" "}
                    {
                      likes?.attributes?.user?.data?.attributes?.profile?.data
                        ?.attributes?.sexo
                    }
                    <br />
                    Provincia:{" "}
                    {
                      likes?.attributes?.user?.data?.attributes?.profile?.data
                        ?.attributes?.provincia
                    }
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
                          navigate(
                            `/profile/${likes?.attributes?.user?.data?.attributes?.profile?.data?.id}`,
                            { replace: true }
                          )
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
                        onClick={() =>
                          console.log(
                            likes?.attributes?.user?.data?.attributes?.profile
                              ?.data?.id
                          )
                        }
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
          ))}
        </ImageList>
      </>
    );
  }
}
