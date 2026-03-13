import { Outlet } from "react-router-dom";
import AdminSidebar from "../../pages/AdminPage/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Aside */}
      <AdminSidebar />

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
