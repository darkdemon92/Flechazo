import "./Tarjetas.css";
import { useState } from "preact/hooks";
import TarjetaPersona from "react-tinder-card";
import { IconButton } from "@mui/material";
import ThumbDownAltSharpIcon from "@mui/icons-material/ThumbDownAltSharp";
import ThumbUpAltSharpIcon from "@mui/icons-material/ThumbUpAltSharp";

export default function Tarjetas() {
  const [persona, setPersona] = useState([
    {
      id: 1,
      nombre: "Ana de Armas",
      img: "https://hips.hearstapps.com/hmg-prod/images/cuban-actress-ana-de-armas-attends-the-95th-annual-academy-news-photo-1678694111.jpg",
      edad: "25",
      provincia: "Pinar del Río",
    },
    {
      id: 2,
      nombre: "Gal Gadot",
      img: "https://www.deusnews.com/src/news/00/00/8B/8D/gal-gadot-en-el-remake-de-hand-in-the-snare-de-hitchcock.jpg",
      edad: "35",
      provincia: "Matanzas",
    },
    {
      id: 3,
      nombre: "Jennifer López",
      img: "https://media.glamour.es/photos/62b18e97c451f1771777bacb/master/pass/Jennifer%20Lopez.jpg",
      edad: "50",
      provincia: "La Habana",
    },
  ]);
  console.log(persona);
  const onSwipe = (direction, id_persona) => {
    console.log("You swiped: " + direction + id_persona);
    if (direction === "left") {
      let newPersona = persona.filter((persona) => persona.id !== id_persona);
      setPersona(newPersona);
    }
    if (direction === "right") {
      console.table("You swiped: " + direction + id_persona);
    }
  };
  return (
    <>
      <div className="tarjeta__contenedor">
        {persona.map((persona) => (
          <TarjetaPersona
            className="swipe"
            key={persona.id}
            preventSwipe={["up", "down"]}
            onSwipe={(direction) => onSwipe(direction, persona.id)}
          >
            <div
              className="tarjeta"
              style={{ backgroundImage: `url(${persona.img})` }}
            >
              <h2>
                Nombre: {persona.nombre}
                &nbsp;&nbsp; Edad: {persona.edad}
                <br />
                Provincia: {persona.provincia}
              </h2>
            </div>
            <div>
              <IconButton onClick={() => onSwipe("left", persona.id)}>
                <ThumbDownAltSharpIcon
                  fontSize="large"
                  style={{ color: "red" }}
                />
              </IconButton>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <IconButton onClick={() => onSwipe("right", persona.id)}>
                <ThumbUpAltSharpIcon
                  fontSize="large"
                  style={{ color: "green" }}
                />
              </IconButton>
            </div>
          </TarjetaPersona>
        ))}
      </div>
    </>
  );
}
