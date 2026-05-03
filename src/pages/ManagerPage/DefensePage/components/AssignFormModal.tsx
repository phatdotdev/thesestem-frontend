import { ArrowLeftRight, FileText, Users } from "lucide-react";
import Button from "../../../../components/UI/Button";
import Input from "../../../../components/UI/Input";
import Modal from "../../../../components/UI/Modal";
import type { CouncilResponse } from "../../../../types/council";
import type { DefenseResponse } from "../../../../types/defense";
import type { ThesisResponse } from "../../../../types/thesis";
import ThesisCard from "./ThesisCard";
import CouncilCard from "./CouncilCard";
import {
  useCreateDefenseMutation,
  useUpdateDefenseMutation,
} from "../../../../services/defenseApi";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../app/hook";
import { addToast } from "../../../../features/notification/toastSlice";

const AssignFormModal = ({
  thesis,
  council,
  defense,
  onClose,
}: {
  thesis: ThesisResponse | null;
  council: CouncilResponse | null;
  defense: DefenseResponse | null;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const isEdit = !!defense;
  const [createDefense] = useCreateDefenseMutation();
  const [updateDefense] = useUpdateDefenseMutation();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    thesisId: "",
    councilId: "",
    defenseTime: "",
    location: "",
  });

  useEffect(() => {
    setForm({
      thesisId: thesis?.id || defense?.thesis.id || "",
      councilId: council?.id || defense?.council.id || "",
      defenseTime: defense?.defenseTime || "",
      location: defense?.location || "",
    });
  }, [thesis, council, defense]);

  const handleSubmit = async () => {
    try {
      if (!form.location) {
        dispatch(
          addToast({
            id: "",
            type: "error",
            message: "Vui lòng nhập địa điểm bảo vệ",
          }),
        );
        return;
      }
      if (!form.defenseTime) {
        dispatch(
          addToast({
            id: "",
            type: "error",
            message: "Vui lòng chọn thời gian bảo vệ",
          }),
        );
        return;
      }

      setSubmitting(true);
      if (defense) {
        await updateDefense({ data: form, id: defense.id }).unwrap();
        dispatch(
          addToast({
            id: "",
            type: "success",
            message: "Cập nhật phân công thành công",
          }),
        );
      } else {
        await createDefense(form).unwrap();
        dispatch(
          addToast({
            id: "",
            type: "success",
            message: "Phân công thành công",
          }),
        );
      }
      onClose();
    } catch (error) {
      dispatch(
        addToast({
          id: "",
          type: "error",
          message: "Có lỗi khi thực hiện phân công",
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={(!!thesis && !!council) || !!defense}
      onClose={onClose}
      width="max-w-3xl"
    >
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
              {isEdit ? "Cập nhật phân công" : "Phân công đề tài"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Gán luận văn vào hội đồng và thiết lập lịch bảo vệ
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* CONTENT */}
        <div className="space-y-5">
          {/* STEP 1: SELECT */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-gray-500 dark:text-gray-400" />
              <p className="text-xs uppercase text-gray-600 dark:text-gray-400 font-semibold tracking-wide">
                Thông tin phân công
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Council */}
              <div className="flex-1">
                {council || defense?.council ? (
                  <CouncilCard council={council || defense?.council} />
                ) : (
                  <div className="h-40 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    Chưa chọn hội đồng
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center pt-4">
                <ArrowLeftRight
                  className="text-gray-300 dark:text-gray-600"
                  size={20}
                />
              </div>

              {/* Thesis */}
              <div className="flex-1">
                {thesis || defense?.thesis ? (
                  <ThesisCard thesis={thesis || defense?.thesis} />
                ) : (
                  <div className="h-40 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                    Chưa chọn luận văn
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STEP 2: SCHEDULE */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <p className="text-xs uppercase text-gray-600 dark:text-gray-400 font-semibold tracking-wide">
                Thông tin bảo vệ
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pl-7">
              <Input
                label="Địa điểm"
                placeholder="Ví dụ: Phòng A101"
                size="sm"
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
              />

              <Input
                type="datetime-local"
                label="Thời gian"
                size="sm"
                value={form.defenseTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, defenseTime: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button label="Hủy" size="sm" variant="outline" onClick={onClose} />

          <Button
            label={isEdit ? "Cập nhật" : "Xác nhận"}
            size="sm"
            variant="primary"
            disabled={!form.thesisId || !form.councilId || submitting}
            loading={submitting}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AssignFormModal;
