import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";

const PublicLayout = () => {
  return (
    <div className="dark:bg-gray-950 dark:text-white min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
