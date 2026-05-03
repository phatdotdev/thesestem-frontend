import { Outlet } from "react-router-dom";
import ManagerThesisTopbar from "./ManagerThesisTopbar";

const ManagerThesisLayout = () => {
  return (
    <>
      <ManagerThesisTopbar />
      <Outlet />
    </>
  );
};

export default ManagerThesisLayout;
