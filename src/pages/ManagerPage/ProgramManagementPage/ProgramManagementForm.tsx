import Input from "../../../components/UI/Input";
import Select from "../../../components/UI/Select";
import Button from "../../../components/UI/Button";
import Textarea from "../../../components/UI/TextArea";
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
  /* ================= STATE ================= */

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [degree, setDegree] = useState("");
  const [managedType, setManagedType] = useState<OrgUnitType | "">("");
  const [managedUnitId, setManagedUnitId] = useState("");

  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );

  /* ================= API ================= */

  const [getColleges] = useLazyGetCollegesQuery();
  const [getFaculties] = useLazyGetFacultiesQuery();
  const [getDepartments] = useLazyGetDeparmentsQuery();

  const [createProgram, { isLoading: isCreating }] = useCreateProgramMutation();

  const [updateProgram, { isLoading: isUpdating }] = useUpdateProgramMutation();

  const isLoading = isCreating || isUpdating;

  /* ================= RESET ================= */

  const resetForm = () => {
    setCode("");
    setName("");
    setDescription("");
    setDegree("");
    setManagedType("");
    setManagedUnitId("");
    setOptions([]);
  };

  /* ================= LOAD PROGRAM ================= */

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
    } else {
      resetForm();
    }
  }, [program]);

  /* ================= FETCH ORG UNITS ================= */

  useEffect(() => {
    const fetchUnits = async () => {
      if (!managedType) {
        setOptions([]);
        setManagedUnitId("");
        return;
      }

      let data: any;

      try {
        if (managedType === "COLLEGE") {
          data = await getColleges().unwrap();
        } else if (managedType === "FACULTY") {
          data = await getFaculties().unwrap();
        } else if (managedType === "DEPARTMENT") {
          data = await getDepartments().unwrap();
        }

        setOptions(
          data.data.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnits();
  }, [managedType]);

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!code || !name || !degree || !managedType || !managedUnitId) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
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

      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= UI ================= */

  return (
    <Modal
      open={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
      width="max-w-2xl"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div
            className="
            w-10 h-10 rounded-xl flex items-center justify-center
            bg-blue-100 dark:bg-blue-900/40
            text-blue-500 dark:text-blue-400
          "
          >
            <Book />
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {!program
                ? "Tạo chương trình đào tạo"
                : "Cập nhật chương trình đào tạo"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Khai báo thông tin chương trình và đơn vị quản lý tương ứng
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <div className="sm:col-span-2">
            <Textarea
              rows={4}
              label="Giới thiệu chương trình"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            required
          />
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        <div className="flex justify-end gap-3">
          <Button
            label="Hủy"
            variant="outline"
            onClick={() => {
              resetForm();
              onClose();
            }}
          />

          <Button
            label={isLoading ? "Đang lưu..." : "Lưu chương trình"}
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TrainingProgramForm;
