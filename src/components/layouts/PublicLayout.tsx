import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";

const PublicLayout = () => {
  return (
    <div className="dark:bg-gray-950 dark:text-white min-h-screen">
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
