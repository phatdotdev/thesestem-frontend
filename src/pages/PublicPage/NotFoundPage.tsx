import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-gray-900 transition-colors">
      <FiAlertCircle
        size={64}
        className="text-gray-400 dark:text-gray-500 mb-4"
      />

      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        404
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>

      <Link
        to="/"
        className="
          font-semibold 
          px-5 py-2.5 
          rounded-xl 
          bg-blue-600 text-white 
          hover:bg-blue-700
          dark:bg-blue-500 dark:hover:bg-blue-600
          shadow-sm hover:shadow
          transition-all
        "
      >
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default NotFoundPage;
