import { Routes, Route } from "react-router-dom";
import { useUserDataStore } from "../store/Store";

import PublicRoutes from "./PublicRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import Error404 from "./error404";
import Alerts from "../helpers/Alerts";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
// import Menu from "../menu/Menu";
// import Tramites from "../tramites/Tramites";
// import Tramitesform from "../forms/Tramitesform";
// import Certificacionesform from "../forms/Certificacionesform";
// import Salidasform from "../forms/Salidasform";

const AppRoutes = () => {
  const { logged } = useUserDataStore((state) => ({
    logged: state.logged,
  }));

  return (
    <>
      <Routes>
        <Route element={<ProtectedRoutes logged={logged} />}>
          {/* <Route path={"/tramites/*"} element={<><Menu /><Tramites /></>} />
          <Route path={"/addtramite/*"} element={<><Menu /><Tramitesform /></>} />
          <Route path={"/certcatastral/*"} element={<><Menu /><Certificacionesform /></>} />
          <Route path={"/entrega/*"} element={<><Menu /><Salidasform /></>} /> */}
          <Route path={"/home/*"} element={<><div>HOME</div></>} />
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
        <Route path={"/*"} element={<Error404 />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
