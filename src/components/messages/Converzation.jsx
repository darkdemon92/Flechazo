import "./Converzation.css";
import { useEffect } from "preact/hooks";
import { useLazyQuery } from "@apollo/client";
import { Converzacion } from "../../querys/querys/MessagesQuerys";
import { useParams } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

import SendMessage from "./SendMessage";

export default function Converzation() {
  const { sender_id, user_id } = useParams();
  //console.log(sender_id, user_id);
  const [GetData,{ loading, error, data, refetch }] = useLazyQuery(Converzacion, {
    variables: {
      sender_id: sender_id,
      recipient_id: user_id,
    },
  });

  useEffect(() => {
    GetData();
  }, [sender_id, user_id])
  

  //console.log(data);

  return (
    <>
      <SendMessage
        user_id={user_id}
        destinatario={sender_id}
        refetch={refetch}
      />
      {data &&
        data.messages.data.map((mensajes) => (
          <div
            key={mensajes.id}
            className={
              mensajes.attributes.sender.data.id === user_id
                ? "message_send"
                : "message_recv"
            }
          >
            <p>
              <Avatar
                alt={
                  mensajes.attributes.sender.data.attributes.profile.data
                    .attributes.nombres_apellidos
                }
                src={`${import.meta.env.VITE_BASE_URL}${
                  mensajes.attributes.sender.data.attributes.profile.data
                    .attributes.avatar?.data?.attributes?.url
                }`}
                sx={{ width: 56, height: 56 }}
              />
              {`El ${new Date(
                mensajes.attributes.createdAt
              ).toLocaleDateString()}`}{" "}
              {mensajes.attributes.sender.data.id === user_id
                ? "Respondiste:"
                : `${mensajes.attributes.sender.data.attributes.profile.data.attributes.nombres_apellidos} Respondió:`}
              <br />
              {mensajes.attributes.message} <br />
            </p>
          </div>
        ))}
    </>
  );
}
