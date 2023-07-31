import { signal } from "@preact/signals";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { toast } from "sonner";
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
import VerifiedSharpIcon from "@mui/icons-material/VerifiedSharp";
import PocketBase from "pocketbase";
import { useEffect, useState } from "preact/hooks";

const modalStatus = signal(false);
const modal2Status = signal(false);
const modal3Status = signal(false);

function Profile({ profile_id }) {
  //console.log("RENDER PROFILE");
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);
  let navigate = useNavigate();
  const [data, setData] = useState("");
  const [dataChange, setDataChange] = useState("");

  if (profile_id) {
    useEffect(async () => {
      try {
        const data = await pb
          .collection("profile")
          .getFirstListItem(`id="${ profile_id }"`, {
            expand: 'avatar, mis_fotos',
        });
        setData(data);
      } catch (error) {
        toast.error(error.message);
      }
    }, [dataChange]);

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
          data={data}
          setDataChange={setDataChange}
        />
        <UploadAvatar
          modal2Status={modal2Status}
          data={data}
          setDataChange={setDataChange}
        />
        <UploadFoto
          modal3Status={modal3Status}
          data={data}
          setDataChange={setDataChange}
        />
        <br />
        <img
          src={
            data.avatar
              ? `${import.meta.env.VITE_BASE_URL}/api/files/avatars/${
                  data.expand.avatar.id
                }/${
                  data.expand.avatar.avatar
                }`
              : data.sexo === "Femenino"
              ? F
              : M || null
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
          {data.nombres_apellidos || null}
        </Typography>
        <Typography component="h1" variant="h4">
          Edad: {data.edad || null}
        </Typography>
        <Typography component="h1" variant="h4">
          Sexo: {data.sexo || null}
        </Typography>
        <Typography component="h1" variant="h4">
          Interés en: {data.intereses || null}
        </Typography>
        <Typography component="h1" variant="h4">
          Provincia: {data.provincia || null}
        </Typography>
        <Typography component="h1" variant="h4">
          {data.verificado ? (
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
          {data.mis_fotos?.length > 0 ? (
            data.expand.mis_fotos.map((fotos) => (
              <ImageListItem key={fotos.id}>
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/api/files/fotos/${
                    fotos.id
                  }/${
                    fotos.foto
                  }?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${import.meta.env.VITE_BASE_URL}/api/files/fotos/${
                    fotos.id
                  }/${
                    fotos.foto
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
  if (!profile_id) {
    toast.error("Debe Crear su Perfil");
    useEffect(() => {
      navigate("/profile/create", { replace: true });
    }, []);
  }
}

export default Profile;
