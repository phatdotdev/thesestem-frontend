import { Outlet } from "react-router-dom";
import StdTopbar from "../../pages/StudentPage/StudentGroupPage/StdTopbar";

const StdGroupLayout = () => {
  return (
    <div>
      <StdTopbar />
      <Outlet />
    </div>
  );
};

export default StdGroupLayout;
