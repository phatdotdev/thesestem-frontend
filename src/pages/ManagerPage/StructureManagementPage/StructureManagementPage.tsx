import { Building, Form, Plus } from "lucide-react";
import { useState } from "react";
import Button from "../../../components/UI/Button";
import { OrgTreeNode } from "./OrgTreeNode";
import { useGetOrgStructureQuery } from "../../../services/orgApi";
import Loader from "../../../components/UI/Loader";
import OrgUnitForm from "./OrgUnitForm";
import { mapOrgResponseToTree } from "../../../utils/mapOrgResponseToTree";

type OrgUnitType = "COLLEGE" | "FACULTY" | "DEPARTMENT";

interface OrgUnit {
  id: string;
  type: OrgUnitType;
  name: string;
  code?: string;
  children?: OrgUnit[];
}

const StructureManagementPage = () => {
  const { data, isLoading } = useGetOrgStructureQuery();
  const [openForm, setOpenForm] = useState(false);
  console.log(data?.data);
  if (isLoading) return <Loader />;

  const orgTree: OrgUnit[] = data?.data ? mapOrgResponseToTree(data.data) : [];

  return (
    <main className="px-6 font-inter space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex gap-4">
          <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-gray-800 dark:text-gray-400">
            <Building size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold dark:text-white">
              Quản lý cơ cấu tổ chức
            </h1>
            <p className="text-sm text-gray-500">
              Quản lý thông tin các đơn vị trực thuộc
            </p>
          </div>
        </div>

        <Button
          label="Thêm đơn vị"
          icon={Plus}
          className="shadow"
          onClick={() => setOpenForm(true)}
        />
      </div>

      {/* Tree */}
      <div className="space-y-5">
        {orgTree.map((node) => (
          <OrgTreeNode key={node.id} isRoot node={node} />
        ))}
      </div>

      {/* Form */}
      <OrgUnitForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          setOpenForm(false);
        }}
      />
    </main>
  );
};

export default StructureManagementPage;
