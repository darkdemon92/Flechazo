import "./Tarjetas.css";
import { signal } from "@preact/signals";
import { useState, useEffect } from "preact/hooks";
import { toast } from "sonner";
import TarjetasView from "./TarjetasView";
import PocketBase from "pocketbase";

const filter_prov = signal("");
const filter_sex = signal("");

export default function Tarjetas({ Plus, user_id }) {
  //console.log("RENDER Tarjetas");
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);
  const [data, setData] = useState([]);

  const filterProv = (event) => {
    filter_prov.value = event.target.value;
  };

  const filterSex = (event) => {
    filter_sex.value = event.target.value;
  };

  useEffect(async () => {
    try {
      const data = await pb.collection("profile").getFullList({
        //sort: '-created', filter: `user!="${ user_id }"` && `edad="1"`, expand: 'avatar',
        sort: "-created",
        filter:
          filter_prov.value !== "" && filter_sex.value !== ""
            ? `user!="${user_id}" && (like!~"${user_id}" && dislike!~"${user_id}") && (like!~"${user_id}" || dislike!~"${user_id}") && provincia="${filter_prov.value}" && sexo="${filter_sex.value}"`
            : filter_prov.value !== ""
            ? `user!="${user_id}" && (like!~"${user_id}" && dislike!~"${user_id}") && provincia="${filter_prov.value}"`
            : filter_sex.value !== ""
            ? `user!="${user_id}" && (like!~"${user_id}" && dislike!~"${user_id}") && sexo="${filter_sex.value}"`
            : `user!="${user_id}" && (like!~"${user_id}" && dislike!~"${user_id}")`,
        expand: "avatar",
      });
      setData(data);
    } catch (error) {
      toast.error(error.message);
    }
  }, [filter_prov.value, filter_sex.value]);

  const onSwiped = async (direction, { persona, dislike, like }) => {
    //console.log("You swiped: " + direction +"/"+ user_id +"/"+ persona +"/"+ dislike +"/"+ like);
    const like_me = pb.authStore.model.like_me;
    //console.log(like_me);
    const dislike_me = pb.authStore.model.like_me;
    //console.log(dislike_me);
    try {
      if (direction && direction === "right") {
        const datos = {
          "like": [...like, user_id],
        };
        const datos2 = {
          "like_me": [...like_me, persona],
        };
        await pb.collection("profile").update(persona, datos);
        await pb.collection("users").update(user_id, datos2);
        setData(data.filter(obj => obj.id !== persona));
      }
      if (direction && direction === "left") {
        const datos = {
          "dislike": [...dislike, user_id],
        };
        const datos2 = {
          "dislike_me": [...dislike_me, persona],
        };
        await pb.collection("profile").update(persona, datos);
        await pb.collection("users").update(user_id, datos2);
        setData(data.filter(obj => obj.id !== persona));
      }
    } catch (error) {
      //console.log(error);
      toast.error(error.message);
    }
  };

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
