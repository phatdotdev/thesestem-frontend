import { Outlet } from "react-router-dom";
import StdSidebar from "../../pages/StudentPage/StdSidebar";

const StudentLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Aside */}
      <StdSidebar />

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-6 max-h-screen overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
