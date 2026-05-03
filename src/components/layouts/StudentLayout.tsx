import { Navigate, Outlet, useParams } from "react-router-dom";
import StdSidebar from "../../pages/StudentPage/StdSidebar";
import NotificationPop from "../NotificationPop/NotificationPop";
import { useEffect } from "react";
import { useGetNotificationsQuery } from "../../services/communicationApi";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  addNotification,
  setNotifications,
} from "../../features/notification/notificationSlice";
import useNotificationSocket from "../../hooks/useNotificationSocket";
import { useGetOrgInfoQuery } from "../../services/orgApi";

const StudentLayout = () => {
  const { "org-code": orgCode } = useParams();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: orgInfoResponse, isLoading: isOrgInfoLoading } =
    useGetOrgInfoQuery(undefined, {
      skip: !isAuthenticated,
    });

  const isValidRole = orgInfoResponse?.data?.role === "STUDENT";
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
      <StdSidebar />

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      <NotificationPop userType="student" />
    </div>
  );
};

export default StudentLayout;
