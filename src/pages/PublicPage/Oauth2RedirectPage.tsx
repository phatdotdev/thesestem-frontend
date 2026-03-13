import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hook";
import { loginSuccess } from "../../features/auth/authSlice";
import Loader from "../../components/UI/Loader";

const OAuth2Redirect = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const params = new URLSearchParams(window.location.search);

    const rawAccessToken = params.get("accessToken");
    const code = params.get("code");

    if (!rawAccessToken || !code) {
      navigate("/login", { replace: true });
      return;
    }

    const accessToken = decodeURIComponent(rawAccessToken);

    console.log("accessToken:", accessToken);
    console.log("code:", code);

    dispatch(loginSuccess({ token: accessToken }));
    localStorage.setItem("accessToken", accessToken);

    navigate(`/${code}/m`, { replace: true });
  }, [dispatch, navigate]);

  return (
    <div className="h-screen">
      <Loader />
    </div>
  );
};

export default OAuth2Redirect;
