import "./error404.css";
import { useNavigate } from "react-router-dom";
import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import Button from "@mui/material/Button";

function Error404() {
  let navigate = useNavigate();
  return (
    <>
      <h1>Error</h1>
      <section className="error-container">
        <span>
          <span>4</span>
        </span>
        <span>0</span>
        <span>
          <span>4</span>
        </span>
      </section>
      <h1>Page Not Found</h1>
      <Button
        variant="outlined"
        onClick={() => navigate("/", { replace: true })}
      >
        <HomeSharpIcon />
        <span>Regresar...</span>
      </Button>
    </>
  );
}

export default Error404;
