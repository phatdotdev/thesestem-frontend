import { MdCalendarMonth } from "react-icons/md";
import { LuCalendarClock } from "react-icons/lu";
import Modal from "../../../../components/UI/Modal";
import Input from "../../../../components/UI/Input";
import Button from "../../../../components/UI/Button";
import Textarea from "../../../../components/UI/TextArea";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
} from "../../../../services/groupApi";

import type { MeetingResponse } from "../../../../types/group";
import { addToast } from "../../../../features/notification/toastSlice";
import { useAppDispatch } from "../../../../app/hook";

const MeetingForm = ({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData: MeetingResponse | null;
}) => {
  const { ["group-id"]: id } = useParams();

  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [description, setDescription] = useState("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStartAt(initialData.startAt);
      setEndAt(initialData.endAt);
    }
  }, [initialData]);

  const [createMeeting] = useCreateMeetingMutation();
  const [updateMeeting] = useUpdateMeetingMutation();

  const handleSubmit = async () => {
    if (!title || !startAt || !endAt) {
      dispatch(
        addToast({
          message: "Vui lòng điền đầy đủ thông tin",
          type: "error",
        }),
      );
      return;
    }

    if (new Date(startAt) >= new Date(endAt)) {
      dispatch(
        addToast({
          message: "Thời gian kết thúc phải sau thời gian bắt đầu",
          type: "error",
        }),
      );
      return;
    }

    try {
      if (initialData) {
        await updateMeeting({
          groupId: id as string,
          meetingId: initialData.id,
          data: {
            title,
            description,
            startAt,
            endAt,
          },
        }).unwrap();

        dispatch(
          addToast({
            message: "Cập nhật cuộc họp thành công",
            type: "success",
          }),
        );
      } else {
        await createMeeting({
          groupId: id as string,
          data: {
            title,
            description,
            startAt,
            endAt,
          },
        }).unwrap();

        dispatch(
          addToast({
            message: "Tạo cuộc họp thành công",
            type: "success",
          }),
        );
      }

      onClose();
    } catch (error) {
      dispatch(
        addToast({
          message: "Có lỗi xảy ra",
          type: "error",
        }),
      );
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-2 space-y-6 text-gray-800 dark:text-gray-100">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div
            className="
              p-2 rounded-xl
              bg-blue-100 text-blue-600
              dark:bg-blue-900/30 dark:text-blue-400
            "
          >
            <LuCalendarClock size={20} />
          </div>

          <div>
            <h1 className="text-lg font-semibold">
              {initialData ? "Chỉnh sửa cuộc họp" : "Tạo cuộc họp mới"}
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {initialData
                ? "Cập nhật thông tin cuộc họp"
                : "Nhập thông tin để tạo cuộc họp mới"}
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <Input
            label="Tiêu đề cuộc họp"
            iconLeft={LuCalendarClock}
            placeholder="Nhập tiêu đề cuộc họp..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            label="Mô tả"
            iconLeft={FileText}
            placeholder="Nhập mô tả cuộc họp..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            label="Thời gian bắt đầu"
            iconLeft={MdCalendarMonth}
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
          />

          <Input
            label="Thời gian kết thúc"
            iconLeft={MdCalendarMonth}
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
          />
        </div>

        {/* FOOTER */}
        <div className="pt-4 flex justify-end gap-3">
          <Button label="Hủy" variant="outline" onClick={onClose} />

          <Button
            label={initialData ? "Cập nhật" : "Tạo cuộc họp"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default MeetingForm;
