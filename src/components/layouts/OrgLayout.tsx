import { Outlet, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useSearchOrgInfoByCodeQuery } from "../../services/orgApi";
import { useAppDispatch } from "../../app/hook";
import { setLogoUrl } from "../../features/organization/organizationSlice";
import defaultFavicon from "../../assets/images/simple-logo.png";

const OrgLayout = () => {
  const { "org-code": orgCode } = useParams();
  const dispatch = useAppDispatch();

  const { data } = useSearchOrgInfoByCodeQuery(orgCode as string);
  const orgInfo = data?.data;

  const defaultFaviconRef = useRef<string>(defaultFavicon);

  useEffect(() => {
    if (orgInfo?.logoUrl) {
      dispatch(setLogoUrl(orgInfo.logoUrl));
    }

    return () => {
      const link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (link) {
        link.href = defaultFaviconRef.current;
      }
    };
  }, [orgInfo?.logoUrl, dispatch]);

  useDocumentMeta({
    title: orgInfo ? `${orgInfo.name} - Thesestem` : "Thesestem",
    favicon: orgInfo?.logoUrl || defaultFaviconRef.current,
  });

  return <Outlet />;
};

export default OrgLayout;
