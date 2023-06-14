import { Navigate } from "react-router-dom";

export const PublicRoutes = ({ children, logged }) => {
  return (
    <>
      {logged ? (
        <Navigate to={"/home"} replace={true} />
      ) : (
        children
      )}
    </>
  );
};

export default PublicRoutes;
