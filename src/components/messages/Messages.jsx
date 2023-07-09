import { useState } from "preact/hooks";
import { useQuery } from "@apollo/client";
import Grid from "@mui/material/Unstable_Grid2";
import {
  PerfilesMensajes,
} from "../../querys/querys/MessagesQuerys";


import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";

import { useNavigate } from "react-router-dom";



export default function Messages({ user_id }) {
  let navigate = useNavigate();
  const [messagedme, setMessagedMe] = useState("");

  const { data: MessagedMeData, refetch: refetch_MessagedMeData } = useQuery(
    PerfilesMensajes,
    {
      variables: { id: user_id },
    }
  );

  if (user_id && user_id !== undefined) {
    setMessagedMe(MessagedMeData?.usersPermissionsUsers?.data);
    refetch_MessagedMeData();
  }

  //console.log(messagedme);

  const handleClick = async ({ sender_id }) => {
    navigate(`/messages/${sender_id}/${user_id}`, {
      replace: true,
    })
  };
  //console.log(converzacion.value);

  return (
    <>
      <Grid container spacing={2}>
        <Grid md={4} sx={{ maxWidth: "20%" }}>
          {messagedme &&
            messagedme.map((message) => (
              <div
                key={message?.id}
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
                      sender_id: message?.id,
                    })
                  }
                >
                  <Avatar
                    alt={
                      message?.attributes?.profile?.data?.attributes
                        ?.nombres_apellidos
                    }
                    src={`${import.meta.env.VITE_BASE_URL}${
                      message?.attributes?.profile?.data?.attributes?.avatar
                        ?.data?.attributes?.url
                    }`}
                    sx={{ width: 56, height: 56 }}
                  />
                </IconButton>
              </div>
            ))}
        </Grid>
        <Grid md={8} sx={{ maxWidth: "80%" }}>
        </Grid>
      </Grid>
    </>
  );
}
