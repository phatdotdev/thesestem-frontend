import { ArrowLeftRight } from "lucide-react";
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
  const isEdit = !!defense;
  const [createDefense] = useCreateDefenseMutation();
  const [updateDefense] = useUpdateDefenseMutation();

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
      if (defense) {
        console.log(form);
        await updateDefense({ data: form, id: defense.id }).unwrap();
      } else {
        await createDefense(form).unwrap();
      }
      onClose();
    } catch (error) {}
  };

  return (
    <Modal
      open={(!!thesis && !!council) || !!defense}
      onClose={onClose}
      width="max-w-3xl"
    >
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {isEdit ? "Cập nhật phân công" : "Phân công đề tài"}
            </h1>
            <p className="text-sm text-gray-500">
              Gán luận văn vào hội đồng và thiết lập lịch bảo vệ
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-5">
          {/* STEP 1: SELECT */}
          <div className="rounded-xl border bg-gray-50/60 p-4">
            <p className="text-xs uppercase text-gray-400 font-semibold mb-3">
              Thông tin phân công
            </p>

            <div className="flex items-center gap-4">
              {/* Council */}
              <div className="flex-1">
                {council || defense?.council ? (
                  <CouncilCard council={council || defense?.council} />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-400 border rounded-xl p-4">
                    Chưa chọn hội đồng
                  </div>
                )}
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <ArrowLeftRight className="text-gray-400" />
              </div>

              {/* Thesis */}
              <div className="flex-1">
                {thesis || defense?.thesis ? (
                  <ThesisCard thesis={thesis || defense?.thesis} />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-400 border rounded-xl p-4">
                    Chưa chọn luận văn
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* STEP 2: SCHEDULE */}
          <div className="rounded-xl border p-4 space-y-4">
            <p className="text-xs uppercase text-gray-400 font-semibold">
              Thông tin bảo vệ
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Địa điểm"
                placeholder="Ví dụ: Phòng A101"
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
              />

              <Input
                type="datetime-local"
                label="Thời gian"
                value={form.defenseTime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, defenseTime: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2 border-t">
          <Button label="Hủy" size="sm" variant="outline" onClick={onClose} />

          <Button
            label={isEdit ? "Cập nhật" : "Xác nhận phân công"}
            size="sm"
            variant="primary"
            disabled={(!thesis || !council) && !defense}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AssignFormModal;
