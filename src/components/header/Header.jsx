import { useEffect, useState } from "preact/hooks";
import { IconButton } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserDataStore } from "../../store/Store";
import PersonSharpIcon from "@mui/icons-material/PersonSharp";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import VolunteerActivismSharpIcon from "@mui/icons-material/VolunteerActivismSharp";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import CampaignSharpIcon from "@mui/icons-material/CampaignSharp";
import Logo from "../../assets/logo.webp";
import "./Header.css";
import { useQuery } from "@apollo/client";
import { cantidad_likes } from "../../querys/querys/Like_DislakeQuerys";

export default function Header({ user_id, retroceder }) {
  //console.log(user_id);
  const [likes, setlikes] = useState(0);
  if (user_id && user_id !== undefined) {
    const { data, refetch } = useQuery(cantidad_likes, {
      variables: { id: user_id },
    });
    setlikes(data?.likes?.data?.length);
    refetch();
  }

  //console.log(likes);

  let navigate = useNavigate();
  const { ClearStore } = useUserDataStore();
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
              <Badge badgeContent={4} color="primary">
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
              ClearStore();
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
