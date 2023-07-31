import TarjetaPersona from "react-tinder-card";
import { IconButton } from "@mui/material";
import HeartBrokenSharpIcon from "@mui/icons-material/HeartBrokenSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import Typography from "@mui/material/Typography";
import SentimentVeryDissatisfiedSharpIcon from "@mui/icons-material/SentimentVeryDissatisfiedSharp";
import VerifiedSharpIcon from "@mui/icons-material/VerifiedSharp";
import ControlPointSharpIcon from "@mui/icons-material/ControlPointSharp";
import F from "../../assets/F.webp";
import M from "../../assets/M.webp";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const provincias = [
  "Pinar del Río",
  "Artemisa",
  "La Habana",
  "Mayabeque",
  "Matanzas",
  "Cienfuegos",
  "Villa Clara",
  "Sancti Spíritus",
  "Ciego de Ávila",
  "Camagüey",
  "Las Tunas",
  "Granma",
  "Holguín",
  "Santiago de Cuba",
  "Guantánamo",
  "Isla de la Juventud",
];

const sexos = ["Masculino", "Femenino"];

export default function TarjetasView({
  data,
  onSwiped,
  filter_prov,
  filterProv,
  filter_sex,
  filterSex,
  Plus,
  setFilters,
}) {
  //console.log("RENDER TarjetasView");
  if (data && data.length > 0) {
    //console.log(data);
    return (
      <>
        {
          <div>
            <Typography
              component="h1"
              variant="h6"
              style={{ marginTop: "5px", color: "red" }}
            >
              Funcionalidad solo para Usuarios Plus
              <ControlPointSharpIcon
                style={{ color: "blue" }}
                fontSize="medium"
              />
            </Typography>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="Provincia">Provincia</InputLabel>
              <Select
                labelId="Provincia"
                id="Provincia"
                value={filter_prov}
                onChange={filterProv}
                label="Provincia"
                disabled={!Plus}
              >
                <MenuItem value="">
                  <em>Todas</em>
                </MenuItem>
                {provincias.map((provincia) => (
                  <MenuItem key={provincia} value={provincia}>
                    {provincia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="Sexo">Sexo</InputLabel>
              <Select
                labelId="Sexo"
                id="Sexo"
                value={filter_sex}
                onChange={filterSex}
                label="Sexo"
                disabled={!Plus}
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {sexos.map((sexo) => (
                  <MenuItem key={sexo} value={sexo}>
                    {sexo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        }
        <div className="tarjeta__contenedor">
          {data.map((persona) => (
            <TarjetaPersona
            className="swipe"
            key={persona.id}
            preventSwipe={["up", "down", "left", "right"]}
            onSwipe={(direction) => onSwiped(direction, persona.id)}
            >
              <div
                className="tarjeta"
                style={{
                  backgroundImage: persona.avatar
                    ? `url(${import.meta.env.VITE_BASE_URL}/api/files/avatars/${
                      persona.expand.avatar.id
                    }/${
                      persona.expand.avatar.avatar
                    })`
                    : persona.sexo === "Femenino"
                    ? `url(${F})`
                    : `url(${M})`,
                }}
              >
                {persona.verificado ? (
                  <VerifiedSharpIcon className="verified" fontSize="large" />
                ) : (
                  <></>
                )}
                <h2>
                  Nombre: {persona.nombres_apellidos}
                  &nbsp;&nbsp; Edad: {persona.edad}
                  <br />
                  Provincia: {persona.provincia}
                </h2>
              </div>
              <div>
                <IconButton onClick={() => onSwiped("left", {persona:persona.id, dislike:persona.dislike})}>
                  <HeartBrokenSharpIcon
                    fontSize="large"
                    style={{ color: "black" }}
                  />
                </IconButton>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <IconButton onClick={() => onSwiped("right", {persona:persona.id, like:persona.like})}>
                  <FavoriteSharpIcon
                    fontSize="large"
                    style={{ color: "red" }}
                  />
                </IconButton>
              </div>
            </TarjetaPersona>
          ))}
        </div>
      </>
    );
  } else {
    return (
      <>
        {
          <div>
            <Typography
              component="h1"
              variant="h6"
              style={{ marginTop: "5px", color: "red" }}
            >
              Funcionalidad solo para Usuarios Plus
              <ControlPointSharpIcon
                style={{ color: "blue" }}
                fontSize="medium"
              />
            </Typography>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="Provincia">Provincia</InputLabel>
              <Select
                labelId="Provincia"
                id="Provincia"
                value={filter_prov}
                onChange={filterProv}
                label="Provincia"
                disabled={!Plus}
              >
                <MenuItem value="">
                  <em>Ninguna</em>
                </MenuItem>
                {provincias.map((provincia) => (
                  <MenuItem key={provincia} value={provincia}>
                    {provincia}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="Sexo">Sexo</InputLabel>
              <Select
                labelId="Sexo"
                id="Sexo"
                value={filter_sex}
                onChange={filterSex}
                label="Sexo"
                disabled={!Plus}
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {sexos.map((sexo) => (
                  <MenuItem key={sexo} value={sexo}>
                    {sexo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        }
        <Typography
          component="h1"
          variant="h6"
          style={{ marginTop: "35px", color: "red" }}
        >
          <SentimentVeryDissatisfiedSharpIcon fontSize="large" />
          Lo Sentimos!!! No tenemos más Perfiles que mostrarle por el momento...
          <SentimentVeryDissatisfiedSharpIcon fontSize="large" />
        </Typography>
      </>
    );
  }
}
