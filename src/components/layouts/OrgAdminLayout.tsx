import { Navigate, Outlet, useParams } from "react-router-dom";
import OrgSidebar from "../../pages/ManagerPage/OrgSidebar";
import ManagerPopChat from "../ManagerPopChat/ManagerPopChat";
import NotificationPop from "../NotificationPop/NotificationPop";
import {
  addNotification,
  setNotifications,
} from "../../features/notification/notificationSlice";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { useGetNotificationsQuery } from "../../services/communicationApi";
import { useEffect } from "react";
import { useGetOrgInfoQuery } from "../../services/orgApi";
import useNotificationSocket from "../../hooks/useNotificationSocket";

const OrgAdminLayout = () => {
  const { "org-code": orgCode } = useParams();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: orgInfoResponse, isLoading: isOrgInfoLoading } =
    useGetOrgInfoQuery(undefined, {
      skip: !isAuthenticated,
    });

  const isValidRole = orgInfoResponse?.data?.role === "MANAGER";
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
      {/* Sidebar */}
      <OrgSidebar />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* <OrgTopbar /> */}

        {/* Scroll area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      <ManagerPopChat />
      <NotificationPop userType="manager" />
    </div>
  );
};

export default OrgAdminLayout;
