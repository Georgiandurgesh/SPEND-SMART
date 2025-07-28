import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import NavBar from "../NavBar";

const PublicRoutes = () => {
  const isAuthenticated = useSelector((state) => !!state.auth?.user);

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default PublicRoutes;
