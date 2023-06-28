import "./Tarjetas.css";
import TarjetaPersona from "react-tinder-card";
import { useEffect } from "preact/hooks";
import { IconButton } from "@mui/material";
import HeartBrokenSharpIcon from "@mui/icons-material/HeartBrokenSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import { useQuery, useMutation } from "@apollo/client";
import { IsPlus } from "../../querys/querys/PlusQuery";
import { GetProfiles } from "../../querys/querys/TarjetasQuerys";
import { Liked, Disliked } from "../../querys/mutations/Like_DislakeMutations";
import { useAlertStore } from "../../store/Store";
import Loadding from "../../helpers/Loadding";
import Typography from "@mui/material/Typography";
import SentimentVeryDissatisfiedSharpIcon from "@mui/icons-material/SentimentVeryDissatisfiedSharp";
import VerifiedSharpIcon from "@mui/icons-material/VerifiedSharp";
import ControlPointSharpIcon from "@mui/icons-material/ControlPointSharp";
import F from "../../assets/F.webp";
import M from "../../assets/M.webp";

export default function Tarjetas({ user_id }) {
  const Plus = useQuery(IsPlus);
  const [I_Liked] = useMutation(Liked);
  const [I_Disliked] = useMutation(Disliked);

  const { loading, error, data, refetch } = Plus.error
    ? useQuery(GetProfiles, {
        variables: { id: user_id },
      })
    : useQuery(GetProfiles, {
        variables: { id: user_id },
      });

  useEffect(() => {
    refetch();
  }, []);

  const {
    ChangeMsgOpen,
    ChangeSeverity,
    ChangeMsg,
    ChangeDuration,
    ChangePositionV,
    ChangePositionH,
  } = useAlertStore();

  const onSwiped = async (direction, id_persona) => {
    //console.log("You swiped: " + direction + id_persona);
    const mutation = direction === "left" ? I_Disliked : I_Liked;
    try {
      await mutation({ variables: { id: user_id, profile: id_persona } });
      console.log("You swiped: " + direction + id_persona);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

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

  if (data && data.profiles.data.length > 0) {
    console.log(data.profiles.data);
    return (
      <>
        {Plus.error ? (
          <div>
            <ControlPointSharpIcon />
            No es Plus+
          </div>
        ) : (
          <div>
            <ControlPointSharpIcon />
            Es Plus+
          </div>
        )}
        <div className="tarjeta__contenedor">
          {data.profiles.data.map((persona) => (
            <TarjetaPersona
              className="swipe"
              key={persona.id}
              preventSwipe={["up", "down", "left", "right"]}
              onSwipe={(direction) => onSwiped(direction, persona.id)}
            >
              <div
                className="tarjeta"
                style={{
                  backgroundImage: persona.attributes.avatar.data
                    ? `url(${import.meta.env.VITE_BASE_URL}${
                        persona.attributes.avatar.data.attributes.url
                      })`
                    : persona.attributes.sexo === "Femenino"
                    ? `url(${F})`
                    : `url(${M})`,
                }}
              >
                {persona.attributes.verificado ? (
                  <VerifiedSharpIcon className="verified" fontSize="large" />
                ) : (
                  <></>
                )}
                <h2>
                  Nombre: {persona.attributes.nombres_apellidos}
                  &nbsp;&nbsp; Edad: {persona.attributes.edad}
                  <br />
                  Provincia: {persona.attributes.provincia}
                </h2>
              </div>
              <div>
                <IconButton onClick={() => onSwiped("left", persona.id)}>
                  <HeartBrokenSharpIcon
                    fontSize="large"
                    style={{ color: "black" }}
                  />
                </IconButton>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <IconButton onClick={() => onSwiped("right", persona.id)}>
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
      <Typography
        component="h1"
        variant="h6"
        style={{ marginTop: "35px", color: "red" }}
      >
        <SentimentVeryDissatisfiedSharpIcon fontSize="large" />
        Lo Sentimos!!! No tenemos más Perfiles que mostrarle por el momento...
        <SentimentVeryDissatisfiedSharpIcon fontSize="large" />
      </Typography>
    );
  }
}
