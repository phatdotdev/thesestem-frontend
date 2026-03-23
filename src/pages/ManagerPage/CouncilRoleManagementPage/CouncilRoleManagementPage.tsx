import { Pencil, Trash2, ShieldCheck, Plus } from "lucide-react";
import { useState } from "react";
import Button from "../../../components/UI/Button";
import CouncilRoleModal from "./CouncilRoleModal";
import type { CouncilRole } from "../../../types/organization";
import DeleteCouncilRoleModal from "./DeleteCouncilRoleModal";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "../../../services/catApi";
import Badge from "../../../components/UI/Badge";

const CouncilRoleManagementPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [editingRole, setEditingRole] = useState<CouncilRole | null>(null);
  const [deletingRole, setDeletingRole] = useState<CouncilRole | null>(null);

  const [deleteRole] = useDeleteRoleMutation();

  const { data: rolesResponse } = useGetRolesQuery();
  const roles = rolesResponse?.data || [];

  /* ================= HANDLERS ================= */

  const handleAdd = () => {
    setEditingRole(null);
    setOpenForm(true);
  };

  const handleEdit = (role: CouncilRole) => {
    setEditingRole(role);
    setOpenForm(true);
  };

  const handleDelete = (role: CouncilRole) => {
    setDeletingRole(role);
    setOpenConfirm(true);
  };

  const handleCloseModal = () => {
    setOpenForm(false);
    setEditingRole(null);
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <ShieldCheck />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý vai trò hội đồng
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Thêm, chỉnh sửa và quản lý vai trò trong hội đồng
            </p>
          </div>
        </div>

        <Button
          icon={Plus}
          label="Thêm vai trò"
          size="sm"
          onClick={handleAdd}
        />
      </div>

      {/* Title */}
      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Danh sách vai trò
      </p>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        {roles.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Mã</th>
                <th className="px-6 py-3 text-left font-medium">Tên vai trò</th>
                <th className="px-6 py-3 text-left font-medium">Mô tả</th>
                <th className="px-6 py-3 text-center font-medium">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {role.code}
                  </td>

                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {role.name}
                  </td>

                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {role.description || "-"}
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Pencil}
                      onClick={() => handleEdit(role)}
                    />

                    <Button
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => handleDelete(role)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-40">
            <Badge label="Chưa có vai trò nào" variant="outline" />
          </div>
        )}
      </div>

      {/* Modal */}
      <CouncilRoleModal
        data={editingRole}
        open={openForm}
        onClose={handleCloseModal}
      />

      <DeleteCouncilRoleModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={() => {
          deleteRole(deletingRole?.id || "");
          setDeletingRole(null);
          setOpenConfirm(false);
        }}
      />
    </div>
  );
};

export default CouncilRoleManagementPage;
