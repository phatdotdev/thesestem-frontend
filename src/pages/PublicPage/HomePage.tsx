import { Link } from "react-router-dom";
import DecorativeLogo from "../../assets/images/decorative-logo.png";
const HomePage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Overlay gradient - thay đổi theo theme */}
      <div className="absolute inset-0" />

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center sm:px-12">
        {/* Logo + Brand */}
        <div className="mb-2 flex flex-col items-center gap-3 md:gap-4">
          <img
            src={DecorativeLogo}
            alt="thesestem"
            className="h-50 w-auto drop-shadow-2xl"
          />
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl lg:text-7xl">
            <span className="text-blue-500" style={{ fontFamily: "Litita" }}>
              thesestem
            </span>
            <span className="dark:text-white">.vn</span>
          </h1>
        </div>

        <p
          className="
          mb-4 max-w-xl
          text-lg sm:text-2xl md:max-w-2xl
          font-semibold leading-relaxed
          text-gray-900 dark:text-gray-100
          drop-shadow-sm dark:drop-shadow-md"
        >
          <span className="text-gray-700 dark:text-gray-300">
            Nền tảng hỗ trợ sinh viên, giảng viên và nhà trường theo dõi, quản
            lý và đánh giá luận văn một cách hiệu quả
          </span>
        </p>

        {/* Call to Action */}
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
          <Link
            to="/register"
            className="
              inline-flex items-center justify-center rounded-full 
              bg-blue-600 px-5 py-2 text-lg font-semibold text-white
              shadow-lg shadow-blue-600/30 transition-all duration-300
              hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-700/40
              focus:outline-none focus:ring-4 focus:ring-blue-400/60
              active:scale-97
              dark:bg-blue-600 dark:hover:bg-blue-700
            "
          >
            Bắt đầu miễn phí
          </Link>

          <Link
            to="/demo"
            className="
              inline-flex items-center justify-center rounded-full
              border-2 border-white/60 px-5 py-4 text-lg font-semibold text-gray-700
              bg-white/10 backdrop-blur-md transition-all duration-300
              hover:bg-white/20 hover:border-white/80
              focus:outline-none focus:ring-2 focus:ring-white/40
              dark:border-blue-400/50 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 dark:hover:border-blue-400/70
              dark:text-blue-100
            "
          >
            Xem demo →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
