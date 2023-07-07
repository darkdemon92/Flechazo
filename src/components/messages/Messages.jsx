import { useState, useEffect } from "preact/hooks";
import { useQuery, useLazyQuery } from "@apollo/client";
import Grid from "@mui/material/Unstable_Grid2";
import {
  PerfilesMensajes,
  id_profile_emisor,
  Converzacion,
} from "../../querys/querys/MessagesQuerys";

import SendMessage from "./SendMessage";
import Converzation from "./Converzation";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";

export default function Messages({ user_id }) {

  
  const [sinleer, setSinLeer] = useState("");
  const [profile_emisor_id, setProfile_emisor_id] = useState("");
  const [profile_receptor_id, setProfile_receptor_id] = useState("");
  const [converzacion, setConverzacion] = useState("");
  useEffect(() => {}, [converzacion])

  const { data: sinLeerData, refetch: refetch_sinLeer } = useQuery(
    PerfilesMensajes,
    {
      variables: { id: user_id },
    }
  );
  const { data: profile_emisor, refetch: refetch_profile_emisor } = useQuery(
    id_profile_emisor,
    {
      variables: { id: user_id },
    }
  );

  if (user_id && user_id !== undefined) {
    setSinLeer(sinLeerData?.usersPermissionsUsers?.data);
    setProfile_emisor_id(
      profile_emisor?.usersPermissionsUser?.data?.attributes?.profile?.data?.id
    );
    refetch_sinLeer();
    refetch_profile_emisor();
  }

  //console.log(sinleer);

  const [converzacion_msg, { refetch: refetch_converzacion_msg }] =
    useLazyQuery(Converzacion);
  const LeerMsg = async ({ receptor_user_id, receptor_profile_id }) => {
    // console.log(
    //   receptor_user_id,
    //   receptor_profile_id,
    //   user_id,
    //   profile_emisor_id
    // );
    const response = await converzacion_msg({
      variables: {
        emisor_user_id: user_id,
        receptor_user_id: receptor_user_id,
        emisor_profile_id: profile_emisor_id,
        receptor_profile_id: receptor_profile_id,
      },
    });
    setConverzacion(response?.data?.messages?.data);
    refetch_converzacion_msg();
  };

  const handleClick = async ({ receptor_user_id, receptor_profile_id }) => {
    await LeerMsg({
      receptor_user_id: receptor_user_id,
      receptor_profile_id: receptor_profile_id,
    });
    setProfile_receptor_id(receptor_profile_id);
  };
  //console.log(converzacion);

  return (
    <>
      <Grid container spacing={2}>
        <Grid md={4} sx={{ maxWidth: "20%" }}>
          {sinleer &&
            sinleer.map((a_leer) => (
              <div
                key={a_leer?.id}
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
                      receptor_user_id:
                        a_leer?.attributes?.profile?.data?.attributes?.user
                          ?.data?.id,
                      receptor_profile_id:
                        a_leer?.attributes?.profile?.data?.id,
                    })
                  }
                >
                  <Avatar
                    alt={
                      a_leer?.attributes?.profile?.data?.attributes
                        ?.nombres_apellidos
                    }
                    src={`${import.meta.env.VITE_BASE_URL}${
                      a_leer?.attributes?.profile?.data?.attributes?.avatar
                        ?.data?.attributes?.url
                    }`}
                    sx={{ width: 56, height: 56 }}
                  />
                </IconButton>
              </div>
            ))}
        </Grid>
        <Grid md={8} sx={{ maxWidth: "80%" }}>
          <SendMessage
            user_id={user_id}
            destinatario={profile_receptor_id}
            refetch={refetch_converzacion_msg}
          />
          <Converzation converzacion={converzacion} />
        </Grid>
      </Grid>
    </>
  );
}
