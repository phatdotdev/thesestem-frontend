import { Outlet } from "react-router-dom";
import LecSidebar from "../../pages/LecturerPage/LecSidebar";
const LecturerLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Aside */}
      <LecSidebar />

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LecturerLayout;
