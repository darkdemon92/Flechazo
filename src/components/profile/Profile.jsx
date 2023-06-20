import { useState, useEffect } from "preact/hooks";
import { useQuery } from "@apollo/client";
import { GetProfile } from "../../querys/querys/ProfileQuerys";
import { useAlertStore } from "../../store/Store";
import Loadding from "../../helpers/Loadding";
import Create from "./Create";

function Profile({ user_id }) {
  //console.log(user_id);
  const {
    ChangeMsgOpen,
    ChangeSeverity,
    ChangeMsg,
    ChangeDuration,
    ChangePositionV,
    ChangePositionH,
  } = useAlertStore();
  const { loading, error, data } = useQuery(GetProfile, {
    variables: { id: user_id },
  });
  if (loading) {
    return <Loadding />;
  }
  if (error) {
    useEffect(() => {
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
    }, [error]);
  }
  if (data && data.profiles.data.length > 0) {
    console.log(data);
    return (
      <>
        <div>Profile</div>
        <div>{data.profiles.data[0].id}</div>
        <div>{data.profiles.data[0].attributes.nombres_apellidos}</div>
        <div>{data.profiles.data[0].attributes.edad}</div>
        <div>{data.profiles.data[0].attributes.sexo}</div>
        <div>{data.profiles.data[0].attributes.provincia}</div>
        {data.profiles.data[0].attributes.avatar.data ? (
          <img
            src={
              `https://backend1.darkprojects.tk` +
              data.profiles.data[0].attributes.avatar.data?.attributes.url
            }
            alt="Avatar"
          />
        ) : (
          <div>NADA</div>
        )}
      </>
    );
  }
  if (data && data.profiles.data.length === 0) {
    return <Create user_id={user_id} />;
  }
}

export default Profile;
