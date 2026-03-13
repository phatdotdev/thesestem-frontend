import Input from "../../../components/UI/Input";
import Select from "../../../components/UI/Select";
import Button from "../../../components/UI/Button";
import {
  useCreateProgramMutation,
  useLazyGetCollegesQuery,
  useLazyGetDeparmentsQuery,
  useLazyGetFacultiesQuery,
  useUpdateProgramMutation,
} from "../../../services/orgApi";
import { useEffect, useState } from "react";
import Modal from "../../../components/UI/Modal";
import type { ProgramResponse } from "../../../types/organization";
import { Book } from "lucide-react";

type OrgUnitType = "COLLEGE" | "FACULTY" | "DEPARTMENT";

const orgUnitTypes = [
  { label: "Trường", value: "COLLEGE" },
  { label: "Khoa", value: "FACULTY" },
  { label: "Bộ môn", value: "DEPARTMENT" },
];

const degreeOptions = [
  { label: "Cử nhân", value: "BACHELOR" },
  { label: "Kỹ sư", value: "ENGINEERING" },
];

const TrainingProgramForm = ({
  open,
  onClose,
  program,
}: {
  open: boolean;
  onClose: () => void;
  program: ProgramResponse | null;
}) => {
  // FORM STATE
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [degree, setDegree] = useState("");
  const [managedType, setManagedType] = useState<OrgUnitType | "">("");
  const [managedUnitId, setManagedUnitId] = useState("");

  useEffect(() => {
    if (program) {
      setCode(program.code);
      setName(program.name);
      setDescription(program.description);
      setDegree(program.degree);
      setManagedType(
        program.college
          ? "COLLEGE"
          : program.faculty
            ? "FACULTY"
            : program.department
              ? "DEPARTMENT"
              : "",
      );
      setManagedUnitId(
        program?.college?.id ||
          program?.faculty?.id ||
          program?.department?.id ||
          "",
      );
    }
  }, [program]);
  // OPTIONS
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );

  // API
  const [getColleges] = useLazyGetCollegesQuery();
  const [getFaculties] = useLazyGetFacultiesQuery();
  const [getDepartments] = useLazyGetDeparmentsQuery();
  const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();
  const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();
  const isLoading = isCreating || isUpdating;
  useEffect(() => {
    const fetchUnits = async () => {
      if (!managedType) {
        setOptions([]);
        setManagedUnitId("");
        return;
      }

      let data: any;

      if (managedType === "COLLEGE") {
        data = await getColleges().unwrap();
      }
      if (managedType === "FACULTY") {
        data = await getFaculties().unwrap();
      }
      if (managedType === "DEPARTMENT") {
        data = await getDepartments().unwrap();
      }

      setOptions(
        data.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      );
    };

    fetchUnits();
  }, [managedType]);

  const handleSubmit = async () => {
    if (!managedType) return;

    if (!program) {
      await createProgram({
        code,
        name,
        description,
        degree,
        managedType,
        collegeId: managedType === "COLLEGE" ? managedUnitId : null,
        facultyId: managedType === "FACULTY" ? managedUnitId : null,
        departmentId: managedType === "DEPARTMENT" ? managedUnitId : null,
      }).unwrap();
    } else {
      await updateProgram({
        id: program.id,
        data: {
          code,
          name,
          description,
          degree,
          managedType,
          collegeId: managedType === "COLLEGE" ? managedUnitId : null,
          facultyId: managedType === "FACULTY" ? managedUnitId : null,
          departmentId: managedType === "DEPARTMENT" ? managedUnitId : null,
        },
      }).unwrap();
    }

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      <div className="p-2 space-y-6">
        {/* Header */}
        <div className="flex gap-3 items-center">
          <div className="p-3 rounded-lg flex items-center justify-center bg-blue-100 text-blue-500">
            <Book />
          </div>
          <h2 className="font-semibold text-lg">
            {!program
              ? "Tạo chương trình đào tạo"
              : "Cập nhật chương trình đào tạo"}
          </h2>
        </div>
        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Mã ngành"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          <Input
            label="Tên ngành"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Mô tả */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Giới thiệu chương trình
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <Select
            label="Loại bằng"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            options={[{ label: "Chọn loại bằng", value: "" }, ...degreeOptions]}
            required
          />

          <Select
            label="Loại đơn vị quản lý"
            value={managedType}
            onChange={(e) => setManagedType(e.target.value as OrgUnitType)}
            options={[
              { label: "Chọn loại đơn vị", value: "" },
              ...orgUnitTypes,
            ]}
            required
          />

          <Select
            label="Đơn vị quản lý"
            value={managedUnitId}
            onChange={(e) => setManagedUnitId(e.target.value)}
            options={[{ label: "Chọn đơn vị quản lý", value: "" }, ...options]}
            disabled={!managedType}
            required={managedType !== "COLLEGE"}
          />
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3">
          <Button
            label="Hủy"
            variant="ghost"
            className="border border-gray-300"
          />
          <Button
            label="Lưu chương trình"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TrainingProgramForm;
