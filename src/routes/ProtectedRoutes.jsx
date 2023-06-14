import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ children, logged }) => {
  return (
    <>
      {!logged ? (
        <Navigate to={"/"} replace={true} />
      ) : children ? (
        children
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default ProtectedRoutes;
