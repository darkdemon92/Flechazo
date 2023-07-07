import { Routes, Route } from "react-router-dom";
import { useUserDataStore } from "../store/Store";
import { useEffect } from "preact/hooks";
import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import Error404 from "./error404";
import Alerts from "../helpers/Alerts";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
import Header from "../components/header/Header";
import Tarjetas from "../components/tarjetas/Tarjetas";
import Profile from "../components/profile/Profile";
import ProfileDetails from "../components/likes/ProfileDetails";
import CreateProfile from "../components/profile/Create";
import { useQuery } from "@apollo/client";
import { IsPlus } from "../querys/querys/PlusQuery";
import Likes from "../components/likes/Likes";
import Messages from "../components/messages/Messages";
import Terminos from "../components/TermsAndFaq/Terminos";
import Anuncios from "../components/Anuncios/Anuncios";

const AppRoutes = () => {
  const { logged, user_id } = useUserDataStore((state) => ({
    logged: state.logged,
    user_id: state.user_data.id,
  }));
  const { data: Plus, refetch } = useQuery(IsPlus);

  useEffect(() => {
    if (logged) {
      refetch();
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
                <Header user_id={user_id} />
                <Tarjetas Plus={Plus} user_id={user_id} />
              </>
            }
          />
          <Route
            path={"/profile/*"}
            element={
              <>
                <Alerts />
                <Header retroceder="/" />
                <Profile Plus={Plus} user_id={user_id} />
              </>
            }
          />
          <Route
            path={"/profile/:id"}
            element={
              <>
                <Alerts />
                <Header retroceder="/likes" />
                <ProfileDetails Plus={Plus} />
              </>
            }
          />
          <Route
            path={"/profile/create/*"}
            element={
              <>
                <Alerts />
                <CreateProfile user_id={user_id} />
              </>
            }
          />
          <Route
            path={"/messages/*"}
            element={
              <>
                <Header retroceder="/" />
                <Messages user_id={user_id} />
              </>
            }
          />
          <Route
            path={"/likes/*"}
            element={
              <>
                <Alerts />
                <Header retroceder="/" />
                <Likes Plus={Plus} user_id={user_id} />
              </>
            }
          />
          <Route
            path={"/anuncios/*"}
            element={
              <>
                <Alerts />
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
              <Alerts />
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path={"/register"}
          element={
            <PublicRoutes logged={logged}>
              <Alerts />
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
