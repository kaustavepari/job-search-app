import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const EmptyRoute = () => {
  const jwtToken = Cookies.get("jwt_token");

  return jwtToken ? <Navigate to="/home" /> : <Navigate to="/home" />;
};

export default EmptyRoute;
