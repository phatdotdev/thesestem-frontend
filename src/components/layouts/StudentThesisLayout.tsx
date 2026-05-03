import { Outlet } from "react-router-dom";
import StudentThesisTopbar from "../../pages/StudentPage/StudentThesesPage/StudentThesisTopbar";

const StudentThesisLayout = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <StudentThesisTopbar />
      <Outlet />
    </div>
  );
};

export default StudentThesisLayout;
