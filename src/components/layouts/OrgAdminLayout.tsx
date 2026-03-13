import { Outlet } from "react-router-dom";
import OrgSidebar from "../../pages/ManagerPage/OrgSidebar";

const OrgAdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <OrgSidebar />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* <OrgTopbar /> */}

        {/* Scroll area */}
        <main className="flex-1  overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrgAdminLayout;
