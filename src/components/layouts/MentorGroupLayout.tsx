import { Outlet } from "react-router-dom";
import LecTopbar from "../../pages/LecturerPage/LecGroupPage/LecTopbar";

const MentorGroupLayout = () => {
  return (
    <>
      <LecTopbar />
      <div className="mt-6">
        <Outlet />
      </div>
    </>
  );
};

export default MentorGroupLayout;
