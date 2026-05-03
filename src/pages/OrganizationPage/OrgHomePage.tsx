import { MapPin, ArrowRight, Building2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useLazyGetOrgInfoQuery,
  useSearchOrgInfoByCodeQuery,
} from "../../services/orgApi";
import Loader from "../../components/UI/Loader";

const OrgHomePage = () => {
  const { "org-code": orgCode } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useSearchOrgInfoByCodeQuery(orgCode as string);

  const orgInfo = data?.data;

  const [getOrgInfo] = useLazyGetOrgInfoQuery();

  const handleNavigate = async () => {
    try {
      const res = await getOrgInfo().unwrap();

      if (!res?.data) {
        navigate(`/${orgCode}/login`);
        return;
      }

      if (res.data.code !== orgCode) {
        navigate(`/${orgCode}/login`);
      } else if (res.data.role === "STUDENT") {
        navigate(`/${orgCode}/s`);
      } else if (res.data.role === "LECTURER") {
        navigate(`/${orgCode}/l`);
      } else if (res.data.role === "MANAGER") {
        navigate(`/${orgCode}/m`);
      } else {
        navigate(`/${orgCode}/login`);
      }
    } catch (err) {
      console.error("Get org info failed", err);
      navigate(`/${orgCode}/login`);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
        <Loader />
      </div>
    );

  if (!orgInfo)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400">
        Không tìm thấy tổ chức
      </div>
    );

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: orgInfo.coverUrl
          ? `url(${orgInfo.coverUrl})`
          : "linear-gradient(to bottom right, #2563eb, #1e3a8a)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div
        className="
          absolute inset-0
          bg-white/70 dark:bg-black/70
          backdrop-blur-sm
        "
      />

      {/* content */}
      <div
        className="
          relative z-10
          text-center
          max-w-2xl
          px-6
          text-gray-900 dark:text-white
        "
      >
        {/* logo */}
        {orgInfo.logoUrl ? (
          <img
            src={orgInfo.logoUrl}
            alt="logo"
            className="
              mx-auto mb-6
              h-24 w-24
              rounded-full
              bg-white/90 dark:bg-gray-200/90
              p-2
              shadow
            "
          />
        ) : (
          <div
            className="
              mx-auto mb-6
              h-24 w-24
              flex items-center justify-center
              rounded-full
              bg-blue-600
              text-white
            "
          >
            <Building2 size={40} />
          </div>
        )}

        {/* name */}
        <h1 className="text-4xl font-bold">{orgInfo.name}</h1>

        {/* description */}
        <p className="mt-4 text-lg opacity-90 leading-relaxed">
          {orgInfo.description}
        </p>

        {/* address */}
        {orgInfo.address && (
          <div className="mt-6 flex items-center justify-center gap-2 opacity-80">
            <MapPin size={16} />
            <span>{orgInfo.address}</span>
          </div>
        )}

        {/* button */}
        <button
          onClick={handleNavigate}
          className="
            mt-10
            inline-flex items-center gap-2
            rounded-xl
            bg-blue-600 dark:bg-blue-500
            px-6 py-3
            text-white
            font-medium
            hover:bg-blue-700 dark:hover:bg-blue-600
            transition
            shadow-lg
          "
        >
          Truy cập vào hệ thống
          <ArrowRight size={18} />
        </button>

        {/* footer */}
        <p className="mt-6 text-sm opacity-70">Thesis Management System</p>
      </div>
    </div>
  );
};

export default OrgHomePage;
