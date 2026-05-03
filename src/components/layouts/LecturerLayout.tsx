import { Navigate, Outlet, useParams } from "react-router-dom";
import LecSidebar from "../../pages/LecturerPage/LecSidebar";
import NotificationPop from "../NotificationPop/NotificationPop";
import { useEffect } from "react";
import { useGetNotificationsQuery } from "../../services/communicationApi";
import {
  addNotification,
  setNotifications,
} from "../../features/notification/notificationSlice";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { useGetOrgInfoQuery } from "../../services/orgApi";
import useNotificationSocket from "../../hooks/useNotificationSocket";

const LecturerLayout = () => {
  const { "org-code": orgCode } = useParams();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: orgInfoResponse, isLoading: isOrgInfoLoading } =
    useGetOrgInfoQuery(undefined, {
      skip: !isAuthenticated,
    });

  const isValidRole = orgInfoResponse?.data?.role === "LECTURER";
  const isValidOrg = orgInfoResponse?.data?.code === orgCode;
  const isAuthorized = Boolean(orgCode) && isValidRole && isValidOrg;

  const { data } = useGetNotificationsQuery(undefined, {
    skip: !isAuthorized,
  });

  const dispatch = useAppDispatch();

  if (!isAuthenticated) {
    return <Navigate to={orgCode ? `/${orgCode}/login` : "/login"} replace />;
  }

  useEffect(() => {
    if (isAuthorized && data?.data) {
      dispatch(setNotifications(data.data));
    }
  }, [data, dispatch, isAuthorized]);

  useNotificationSocket((notification) => {
    dispatch(addNotification(notification));
  }, isAuthorized);

  if (isOrgInfoLoading) {
    return null;
  }

  if (!isAuthorized) {
    return <Navigate to={orgCode ? `/${orgCode}/login` : "/login"} replace />;
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Aside */}
      <LecSidebar />

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      <NotificationPop userType="lecturer" />
    </div>
  );
};

export default LecturerLayout;
