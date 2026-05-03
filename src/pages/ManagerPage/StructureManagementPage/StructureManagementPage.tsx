import { Building2, Plus, RefreshCcw } from "lucide-react";
import { useState } from "react";
import Button from "../../../components/UI/Button";
import { OrgTreeNode } from "./OrgTreeNode";
import { useGetOrgStructureQuery } from "../../../services/orgApi";
import Loader from "../../../components/UI/Loader";
import OrgUnitForm from "./OrgUnitForm";
import { mapOrgResponseToTree } from "../../../utils/mapOrgResponseToTree";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

type OrgUnitType = "COLLEGE" | "FACULTY" | "DEPARTMENT";

interface OrgUnit {
  id: string;
  type: OrgUnitType;
  name: string;
  code?: string;
  children?: OrgUnit[];
}

const StructureManagementPage = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError, refetch } = useGetOrgStructureQuery();
  const [openForm, setOpenForm] = useState(false);

  if (isLoading) return <Loader />;

  const orgTree: OrgUnit[] = data?.data ? mapOrgResponseToTree(data.data) : [];

  return (
    <main className="space-y-6 px-6 pb-6 font-inter">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <Building2 size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Quản lý cơ cấu tổ chức
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Theo dõi và quản trị cấu trúc Trường, Khoa, Bộ môn trên toàn hệ
                thống.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              label="Làm mới"
              icon={RefreshCcw}
              variant="outline"
              className="bg-white dark:bg-gray-800"
              size="sm"
              onClick={() => refetch()}
            />
            <Button
              label="Thêm đơn vị"
              icon={Plus}
              className="shadow"
              size="sm"
              onClick={() => setOpenForm(true)}
            />
          </div>
        </div>
      </section>

      {isError && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-900/60 dark:bg-rose-950/20">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
            Không thể tải cơ cấu tổ chức. Vui lòng thử lại.
          </p>
          <Button
            label="Thử lại"
            icon={RefreshCcw}
            variant="outline-danger"
            className="mt-3"
            size="sm"
            onClick={() => refetch()}
          />
        </section>
      )}

      {!isError && orgTree.length === 0 && (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Chưa có đơn vị nào trong cơ cấu
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Bắt đầu bằng cách tạo Trường, Khoa hoặc Bộ môn đầu tiên.
          </p>
          <Button
            label="Tạo đơn vị đầu tiên"
            icon={Plus}
            className="mt-4"
            size="sm"
            onClick={() => setOpenForm(true)}
          />
        </section>
      )}

      <div className="space-y-5">
        {orgTree.map((node) => (
          <OrgTreeNode key={node.id} isRoot node={node} />
        ))}
      </div>

      <OrgUnitForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          setOpenForm(false);
          dispatch(
            addToast({
              type: "success",
              message: "Đã tạo đơn vị thành công",
            }),
          );
        }}
        onError={() => {
          dispatch(
            addToast({
              type: "error",
              message: "Không thể tạo đơn vị. Vui lòng thử lại.",
            }),
          );
        }}
        onValidationError={(message) => {
          dispatch(addToast({ type: "warning", message }));
        }}
      />
    </main>
  );
};

export default StructureManagementPage;
