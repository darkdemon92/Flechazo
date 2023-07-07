import "./Converzation.css";
import { useEffect } from "preact/hooks";

export default function Converzation({ converzacion }) {
  //console.log(converzacion);
  useEffect(() => {}, [converzacion]);
  return (
    <>
      {converzacion &&
        converzacion.map((mensajes) => (
          <div
            key={mensajes.id}
            className={
              mensajes.attributes.user.data.id === "1"
                ? "message_send"
                : "message_recv"
            }
          >
            <p>
              {new Date(mensajes.attributes.createdAt).toLocaleDateString()}
              <br />
              {mensajes.attributes.user.data.attributes.username}:{" "}
              {mensajes.attributes.mensaje} <br />
            </p>
          </div>
        ))}
    </>
  );
}
