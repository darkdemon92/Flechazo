import { useEffect, useState } from "preact/hooks";
import { IconButton } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import PersonSharpIcon from "@mui/icons-material/PersonSharp";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import VolunteerActivismSharpIcon from "@mui/icons-material/VolunteerActivismSharp";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import CampaignSharpIcon from "@mui/icons-material/CampaignSharp";
import Logo from "../../assets/logo.webp";
import "./Header.css";
import { toast } from "sonner";
import PocketBase from 'pocketbase';

export default function Header({ user_id, profile_id, retroceder }) {
  //console.log("RENDER Header");
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);
  //console.log(user_id);
  const [likes, setlikes] = useState(0);
  const [mensajes, setmensajes] = useState(0);

  useEffect(async () => {
    try {
      const cantlikes = await pb.collection("users").getFullList({
        sort: "-created",
        filter:`id!="${user_id}" && like_me~"${profile_id}"`,
      });
      setlikes(cantlikes.length);
    } catch (error) {
      toast.error(error.message);
    }
    try {
      const mensajes = await pb.collection('mensajes').getFullList({
        sort: '+created',
        filter: `destinatario="${profile_id}"`,
      });
      //console.log(mensajes);
      let remitentes = {};
      let mensajesSinDuplicados = [];
      for (let i = 0; i < mensajes.length; i++) {
        if (!remitentes[mensajes[i].remitente]) {
          remitentes[mensajes[i].remitente] = true;
          mensajesSinDuplicados.push(mensajes[i]);
        }
      }
      //console.log(mensajesSinDuplicados);
      setmensajes(mensajesSinDuplicados.length);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  let navigate = useNavigate();
  return (
    <div className="header">
      {retroceder ? (
        <>
          <NavLink to={retroceder} end>
            <IconButton>
              <ArrowBackIosNewSharpIcon fontSize="large" color="error" />
            </IconButton>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to={"/profile"} end>
            <IconButton>
              <PersonSharpIcon fontSize="large" color="success" />
            </IconButton>
          </NavLink>
          <NavLink to={"/"} end>
            <IconButton>
              <img src={Logo} className="header__logo" alt="logo" />
            </IconButton>
          </NavLink>
          <NavLink to={"/messages"} end>
            <IconButton>
              <Badge badgeContent={mensajes} color="primary">
                <MailIcon fontSize="large" color="warning" />
              </Badge>
            </IconButton>
          </NavLink>
          <NavLink to={"/likes"} end>
            <IconButton>
              <Badge badgeContent={likes} color="error">
                <VolunteerActivismSharpIcon fontSize="large" color="primary" />
              </Badge>
            </IconButton>
          </NavLink>
          <NavLink to={"/anuncios"} end>
            <IconButton>
              <Badge badgeContent={1} color="error">
                <CampaignSharpIcon fontSize="large" color="warning" />
              </Badge>
            </IconButton>
          </NavLink>

          <IconButton
            onClick={() => {
              toast.message(`Hasta Pronto ${ pb.authStore.model.username }`);
              pb.authStore.clear();
              navigate("/", { replace: true });
            }}
          >
            <LogoutSharpIcon fontSize="large" color="error" />
          </IconButton>
        </>
      )}
    </div>
  );
}
