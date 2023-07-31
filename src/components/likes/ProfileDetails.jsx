import { useState, useEffect } from "preact/hooks";
import "./Likes.css";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { toast } from "sonner";
import F from "../../assets/F.webp";
import M from "../../assets/M.webp";
import DoNotDisturbSharpIcon from "@mui/icons-material/DoNotDisturbSharp";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import VerifiedSharpIcon from "@mui/icons-material/VerifiedSharp";
import PocketBase from "pocketbase";

function ProfileDetails({ Plus }) {
  //console.log("RENDER ProfileDetails");
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);
  const { id } = useParams();
  const [data, setData] = useState("");

  if (id) {
    useEffect(async () => {
      try {
        const data = await pb.collection("profile").getOne(id, {
          expand: "avatar, mis_fotos",
        });
        setData(data);
      } catch (error) {
        toast.error(error.message);
      }
    }, []);
    //console.log(data);
  }

  if (data) {
    const profileData = data;
    const Avatar = profileData.expand.avatar;
    const fotos = profileData.expand.mis_fotos;
    return (
      <div className={Plus && Plus.pluses === null ? "avatar" : "avatar_plus"}>
        <Typography component="h1" variant="h3" style={{ color: "blue" }}>
          Perfil de {profileData.nombres_apellidos}
        </Typography>
        <img
          src={
            Avatar
              ? `${import.meta.env.VITE_BASE_URL}/api/files/avatars/${
                  Avatar.id
                }/${Avatar.avatar}`
              : profileData.sexo === "Femenino"
              ? F
              : M
          }
          alt="Avatar"
          style={{ maxWidth: "300px", padding: "5px", borderRadius: "20px" }}
        />
        <Typography component="h1" variant="h4">
          Nombres y Apellidos: {profileData.nombres_apellidos || null}
        </Typography>
        <Typography component="h1" variant="h4">
          Edad: {profileData.edad || null}
        </Typography>
        <Typography component="h1" variant="h4">
          Sexo: {profileData.sexo || null}
        </Typography>
        <Typography component="h1" variant="h4">
          Interés en: {profileData.intereses || null}
        </Typography>
        <Typography component="h1" variant="h4">
          Provincia: {profileData.provincia || null}
        </Typography>
        <Typography component="h1" variant="h4">
          {profileData.verificado ? (
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
          Fotos de {profileData.nombres_apellidos}
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
                  src={`${import.meta.env.VITE_BASE_URL}/api/files/fotos/${
                    fotos.id
                  }/${fotos.foto}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${import.meta.env.VITE_BASE_URL}/api/files/fotos/${
                    fotos.id
                  }/${fotos.foto}?w=164&h=164&fit=crop&auto=format`}
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
