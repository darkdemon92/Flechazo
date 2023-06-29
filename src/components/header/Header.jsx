import { IconButton } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserDataStore } from "../../store/Store";
import PersonSharpIcon from "@mui/icons-material/PersonSharp";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import VolunteerActivismSharpIcon from '@mui/icons-material/VolunteerActivismSharp';
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import Logo from "../../assets/logo.webp";
import "./Header.css";

export default function Header({ retroceder }) {
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
          <NavLink to={"/messages"} end>
            <IconButton>
              <Badge badgeContent={6} color="error">
                <VolunteerActivismSharpIcon fontSize="large" color="primary" />
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
