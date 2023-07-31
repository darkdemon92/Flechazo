import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "preact/hooks";
import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import Error404 from "./error404";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
import Header from "../components/header/Header";
import Tarjetas from "../components/tarjetas/Tarjetas";
import Profile from "../components/profile/Profile";
import ProfileDetails from "../components/likes/ProfileDetails";
import CreateProfile from "../components/profile/Create";
import Likes from "../components/likes/Likes";
import Messages from "../components/messages/Messages";
import Terminos from "../components/TermsAndFaq/Terminos";
import Anuncios from "../components/Anuncios/Anuncios";
import PocketBase from "pocketbase";
import { toast } from "sonner";

const AppRoutes = () => {
  let navigate = useNavigate();
  const pb = new PocketBase(`${import.meta.env.VITE_BASE_URL}`);
  const logged = pb.authStore.isValid;
  const user_id = pb.authStore.model ? pb.authStore.model.id : null;
  const Plus = pb.authStore.model ? pb.authStore.model.plus : false;
  const profile_id = pb.authStore.model ? pb.authStore.model.profile : null;

  useEffect(() => {
    if (!logged) {
      pb.authStore.clear();
      toast.message("Debe Autenticarse Nuevamente");
      navigate("/", { replace: true });
    }
  }, [logged]);

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoutes logged={logged} />}>
          <Route
            path={"/home/*"}
            element={
              <>
                <Header user_id={user_id} profile_id={profile_id}  /> 
                <Tarjetas Plus={Plus} user_id={user_id} />
              </>
            }
          />
          <Route
            path={"/profile/*"}
            element={
              <>
                <Header retroceder="/" />
                <Profile profile_id={profile_id} />
              </>
            }
          />
          <Route
            path={"/profile/:id"}
            element={
              <>
                <Header retroceder="/likes" />
                <ProfileDetails Plus={Plus} />
              </>
            }
          />
          <Route
            path={"/profile/create/*"}
            element={
              <>
                <CreateProfile user_id={user_id} />
              </>
            }
          />
          <Route
            path={"/likes/*"}
            element={
              <>
                <Header retroceder="/" />
                <Likes Plus={Plus} user_id={user_id} profile_id={profile_id} />
              </>
            }
          />

          <Route
            path={"/messages/*"}
            element={
              <>
                <Header retroceder="/" />
                <Messages user_id={user_id} profile_id={profile_id} />
              </>
            }
          />
          <Route
            path={"/anuncios/*"}
            element={
              <>
                <Header retroceder="/" />
                <Anuncios />
              </>
            }
          />
        </Route>
        <Route
          path={"/"}
          element={
            <PublicRoutes logged={logged}>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path={"/register"}
          element={
            <PublicRoutes logged={logged}>
              <Register />
            </PublicRoutes>
          }
        />
        <Route
          path={"/terms"}
          element={
            <PublicRoutes logged={logged}>
              <Header retroceder="/" />
              <Terminos />
            </PublicRoutes>
          }
        />
        <Route path={"/*"} element={<Error404 />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
