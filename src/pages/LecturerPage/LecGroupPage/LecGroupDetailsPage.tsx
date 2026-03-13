import { Outlet } from "react-router-dom";
import LecTopbar from "./LecTopbar";

const LecGroupDetailsPage = () => {
  return (
    <div>
      <LecTopbar />
      <Outlet />
    </div>
  );
};

export default LecGroupDetailsPage;
