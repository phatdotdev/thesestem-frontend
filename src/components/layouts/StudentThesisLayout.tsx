import { Outlet } from "react-router-dom";
import StudentThesisTopbar from "../../pages/StudentPage/StudentThesesPage/StudentThesisTopbar";

const StudentThesisLayout = () => {
  return (
    <>
      <StudentThesisTopbar />
      <Outlet />
    </>
  );
};

export default StudentThesisLayout;
