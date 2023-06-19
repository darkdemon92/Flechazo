import { IconButton } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useUserDataStore } from "../../store/Store";
import PersonSharpIcon from "@mui/icons-material/PersonSharp";
import QuestionAnswerSharpIcon from "@mui/icons-material/QuestionAnswerSharp";
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
              <ArrowBackIosNewSharpIcon fontSize="large" />
            </IconButton>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to={"/profile"} end>
            <IconButton>
              <PersonSharpIcon fontSize="large" />
            </IconButton>
          </NavLink>
          <NavLink to={"/"} end>
            <IconButton>
              <img src={Logo} className="header__logo" alt="logo" />
            </IconButton>
          </NavLink>
          <NavLink to={"/messages"} end>
            <IconButton>
              <QuestionAnswerSharpIcon fontSize="large" />
            </IconButton>
          </NavLink>
          <IconButton
            onClick={() => {
              ClearStore();
              navigate("/", { replace: true });
            }}
          >
            <LogoutSharpIcon fontSize="large" />
          </IconButton>
        </>
      )}
    </div>
  );
}
