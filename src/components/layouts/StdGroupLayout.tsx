import { Outlet } from "react-router-dom";
import StdTopbar from "../../pages/StudentPage/StudentGroupPage/StdTopbar";

const StdGroupLayout = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <StdTopbar />
      <Outlet />
    </div>
  );
};

export default StdGroupLayout;
