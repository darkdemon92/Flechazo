import "./Tarjetas.css";
import { signal } from "@preact/signals";
import { useQuery, useMutation } from "@apollo/client";
import { GetProfiles } from "../../querys/querys/TarjetasQuerys";
import { Liked, Disliked } from "../../querys/mutations/Like_DislakeMutations";
import { useAlertStore } from "../../store/Store";
import Loadding from "../../helpers/Loadding";
const filter_prov = signal("");
const filter_sex = signal("");
import TarjetasView from "./TarjetasView";

export default function Tarjetas({ Plus, user_id }) {
  //console.log(Plus.pluses)
  const [I_Liked] = useMutation(Liked);
  const [I_Disliked] = useMutation(Disliked);

  const filterProv = (event) => {
    filter_prov.value = event.target.value;
  };

  const filterSex = (event) => {
    filter_sex.value = event.target.value;
  };

  const variables_filter = { id: user_id };
  if (filter_prov.value !== "") {
    variables_filter.provincia = filter_prov.value;
  }
  if (filter_sex.value !== "") {
    variables_filter.sexo = filter_sex.value;
  }

  const { loading, error, data, refetch } = useQuery(GetProfiles, {
    variables: variables_filter,
  });

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
      //console.log("You swiped: " + direction + id_persona);
      refetch();
    } catch (error) {
      console.log(error);
      ChangeMsgOpen(true);
      ChangeSeverity("error");
      ChangeMsg("Ocurrió un error al dar Like al perfil");
      ChangeDuration(2000);
      ChangePositionV("top");
      ChangePositionH("center");
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

  //console.log(filter_sex.value);
  return (
    <TarjetasView
      data={data}
      onSwiped={onSwiped}
      filter_prov={filter_prov.value}
      filterProv={filterProv}
      filter_sex={filter_sex.value}
      filterSex={filterSex}
      Plus={Plus}
    />
  );
}
