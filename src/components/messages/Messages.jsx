import "./Messages.css";
import { useState, useEffect } from "preact/hooks";
import Grid from "@mui/material/Unstable_Grid2";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import PocketBase from "pocketbase";
import { toast } from "sonner";
import F from "../../assets/F.webp";
import M from "../../assets/M.webp";
import SendMessage from "./SendMessage";

export default function Messages({ user_id, profile_id }) {
  //console.log("RENDER MESSAGES");
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);
  let navigate = useNavigate();
  const [message_me, setMessage_Me] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [messages, setMessages] = useState([]);

  if (profile_id) {
    useEffect(async () => {
      try {
        const mensajes = await pb.collection('mensajes').getFullList({
          sort: '+created',
          filter: `destinatario="${profile_id}"`,
          expand: "remitente, remitente.profile.avatar"
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
        setMessage_Me(mensajesSinDuplicados);
      } catch (error) {
        toast.error(error.message);
      }
    }, []);
    //console.log(message_me);
  }


  const handleClick = async ({ senderUser_id, senderProfile_id }) => {
    //console.log(senderUser_id, senderProfile_id, user_id, profile_id);
    setDestinatario(senderProfile_id);
    const mensajes = await pb.collection('mensajes').getFullList({
      sort: '+created',
      filter: `(destinatario="${profile_id}" && remitente="${senderUser_id}") || (destinatario="${senderProfile_id}" && remitente="${user_id}")`,
      expand: "remitente, remitente.profile"
    });
    setMessages(mensajes);
    //console.log(mensajes);
  };
  
  return (
    <>
      <Grid container spacing={2}>
        <Grid md={4} sx={{ maxWidth: "20%" }}>
          {(message_me && message_me.length > 0) &&
            message_me.map((person) => (
              <div
                key={person.expand.remitente.profile}
                style={{
                  position: "relative",
                  marginTop: "5px",
                  marginBottom: "10px",
                }}
              >
                <IconButton
                  color="primary"
                  aria-label="Ver Mensaje"
                  onClick={async () =>
                    handleClick({
                      senderUser_id: person.expand.remitente.id,
                      senderProfile_id: person.expand.remitente.profile,
                    })
                  }
                >
                  <Avatar
                    alt={
                      person.expand.remitente.expand.profile.nombres_apellidos || null
                    }
                    src={
                      person.expand.remitente.expand.profile.avatar ? `${import.meta.env.VITE_BASE_URL}/api/files/avatars/${person.expand.remitente.expand.profile.expand.avatar.id}/${person.expand.remitente.expand.profile.expand.avatar.avatar}` : person.expand.remitente.expand.profile.sexo === "Femenino" ? F : M || null
                    }
                    sx={{ width: 56, height: 56 }}
                  />
                </IconButton>
              </div>
            ))}
        </Grid>
        <Grid md={8} sx={{ maxWidth: "80%" }}>
          {(messages && messages.length > 0) && 
            <>
              <SendMessage
                user_id={user_id}
                destinatario={destinatario}
                messages = {messages}
                setMessages = {setMessages}
              />
              {messages.map((mensaje) => (
                <div
                  key={mensaje.id}
                  className={
                    mensaje.remitente === user_id
                    ? "message_send"
                    : "message_recv"
                  }
                >
                  <p>
                    {`El ${new Date(
                      mensaje.created
                    ).toLocaleDateString()}`}{" "}
                    {mensaje.remitente === user_id
                      ? "Escribiste:"
                      : `${mensaje.expand.remitente.expand.profile.nombres_apellidos} Escribió:`
                    }
                    <br />
                    {mensaje.mensaje}
                  </p>
                </div>
              ))}
            </>
          }
          {(messages && messages.length === 0) &&
            <Typography
            component="h1"
            variant="h6"
            style={{ color: "green" }}
            >
              Seleccione el Avatar para ver los MENSAJES
            </Typography>
          }
        </Grid>
      </Grid>
    </>
  );
}
