import { FaMagnifyingGlass } from "react-icons/fa6";
import Button from "../../../components/UI/Button";
import { Plus, UserRoundCog } from "lucide-react";
import Input from "../../../components/UI/Input";
import { useSearchManagersQuery } from "../../../services/userApi";
import ManagerCard from "./ManagerCard";
import type { ManagerResponse } from "../../../types/user";
import { useState } from "react";
import ManagerFormModal from "./ManagerFormModal";

const UserManagementPage = () => {
  const [filters, setFilters] = useState({
    username: "",
    code: "",
    name: "",
  });

  const [page, setPage] = useState(0);
  const size = 5;

  const { data: userResponse } = useSearchManagersQuery({
    ...filters,
    size,
    page,
  });
  const totalPages = userResponse?.data?.totalPages || 0;
  const managers = userResponse?.data?.content || [];
  const [openManagerForm, setOpenManagerForm] = useState(false);
  const handleChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const [selectedManager, setSelectedManager] =
    useState<ManagerResponse | null>(null);
  const handleSearch = () => {
    setPage(0);
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 rounded-xl p-3 flex items-center justify-center">
            <UserRoundCog size={28} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Quản lý người dùng
            </h1>
            <p className="text-sm text-gray-500">
              Quản lý tài khoản người dùng trong hệ thống
            </p>
          </div>
        </div>

        <Button
          size="sm"
          label="Thêm người dùng"
          icon={Plus}
          onClick={() => {
            {
              setSelectedManager(null);
              setOpenManagerForm(true);
            }
          }}
        />
      </div>

      {/* FILTER */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-gray-700">Tìm kiếm người dùng</h2>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            label="Email người dùng"
            placeholder="Nhập email người dùng..."
            value={filters.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />

          <Input
            label="Mã tổ chức"
            placeholder="Nhập mã tổ chức..."
            value={filters.code}
            onChange={(e) => handleChange("code", e.target.value)}
          />

          <Input
            label="Tên tổ chức"
            placeholder="Nhập tên tổ chức..."
            value={filters.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* ACTION */}
        <div className="flex justify-end">
          <Button
            icon={FaMagnifyingGlass}
            label="Tìm kiếm"
            size="sm"
            onClick={handleSearch}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-gray-700">Danh sách người dùng</h2>
        </div>
        {managers ? (
          managers.map((manager: ManagerResponse) => (
            <ManagerCard
              key={manager.id}
              manager={manager}
              onSelect={() => {
                {
                  setSelectedManager(manager);
                  setOpenManagerForm(true);
                }
              }}
            />
          ))
        ) : (
          <div className="text-sm text-gray-500 italic">
            Chưa có dữ liệu người dùng
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <Button
              size="xs"
              label="Prev"
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            />

            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                size="xs"
                label={(i + 1).toString()}
                variant={i === page ? "primary" : "outline"}
                onClick={() => setPage(i)}
              />
            ))}

            <Button
              size="xs"
              label="Next"
              variant="outline"
              disabled={page === totalPages - 1}
              onClick={() => setPage(page + 1)}
            />
          </div>
        )}
      </div>
      <ManagerFormModal
        open={openManagerForm}
        onClose={() => setOpenManagerForm(false)}
        manager={selectedManager}
      />
    </div>
  );
};

export default UserManagementPage;
