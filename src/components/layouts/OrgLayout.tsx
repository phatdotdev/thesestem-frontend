import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useSearchOrgInfoByCodeQuery } from "../../services/orgApi";
import { useAppDispatch } from "../../app/hook";
import { setLogoUrl } from "../../features/organization/organizationSlice";

const OrgLayout = () => {
  const { "org-code": orgCode } = useParams();
  const dispatch = useAppDispatch();

  const { data } = useSearchOrgInfoByCodeQuery(orgCode as string);
  const orgInfo = data?.data;
  useEffect(() => {
    if (orgInfo?.logoUrl) {
      dispatch(setLogoUrl(orgInfo.logoUrl));
    }
  }, [orgInfo?.logoUrl, dispatch]);

  useDocumentMeta({
    title: orgInfo ? `${orgInfo.name} - Thesestem` : "Thesestem",
    favicon: orgInfo?.logoUrl,
  });

  return <Outlet />;
};

export default OrgLayout;
