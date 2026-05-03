import React, { useMemo, useState } from "react";
import { BellRing, Megaphone, Plus, Sparkles } from "lucide-react";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Modal from "../../../components/UI/Modal";
import Select from "../../../components/UI/Select";
import Textarea from "../../../components/UI/TextArea";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";
import {
  useGetSystemNotificationsQuery,
  useSendSystemNotificationMutation,
} from "../../../services/communicationApi";

const SYSTEM_ANNOUNCEMENT_LABEL = "Thông báo hệ thống";

type RecipientGroup = "" | "MANAGER" | "STUDENT" | "LECTURER";

type NotificationDraft = {
  title: string;
  content: string;
  recipientGroup: RecipientGroup | "";
};

type CreatedNotification = {
  id: string;
  title: string;
  content: string;
  recipientGroup: RecipientGroup | "";
  type: string;
  createdAt: string;
};

type SystemNotificationApiItem = {
  type: string;
  id?: string;
  title?: string;
  content?: string;
  message?: string;
  recipientGroup?: string;
  userType?: string;
  targetGroup?: string;
  createdAt?: string;
};

const recipientGroupLabelMap: Record<RecipientGroup, string> = {
  "": "Toàn bộ người dùng hệ thống",
  MANAGER: "Quản lý tổ chức",
  STUDENT: "Học sinh",
  LECTURER: "Giảng viên",
};

const recipientGroupOptions = [
  { label: "Toàn bộ người dùng hệ thống", value: "" },
  { label: "Quản lý tổ chức", value: "MANAGER" },
  { label: "Học sinh", value: "STUDENT" },
  { label: "Giảng viên", value: "LECTURER" },
];

const emptyDraft: NotificationDraft = {
  title: "",
  content: "",
  recipientGroup: "",
};

const AdminDashboardPage = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draft, setDraft] = useState<NotificationDraft>(emptyDraft);
  const [errors, setErrors] = useState<
    Partial<Record<keyof NotificationDraft, string>>
  >({});
  const [notifications, setNotifications] = useState<CreatedNotification[]>([]);
  const { data: systemNotificationsData } = useGetSystemNotificationsQuery();
  const [createNotification] = useSendSystemNotificationMutation();
  const mappedServerNotifications = useMemo<CreatedNotification[]>(() => {
    const rawItems = (systemNotificationsData?.data ??
      []) as SystemNotificationApiItem[];

    return rawItems.map((item) => {
      const rawGroup =
        item.recipientGroup || item.userType || item.targetGroup || "ALL_USERS";

      const normalizedGroup: RecipientGroup =
        rawGroup === "MANAGER" ||
        rawGroup === "STUDENT" ||
        rawGroup === "LECTURER"
          ? rawGroup
          : "";

      return {
        id: item.id || crypto.randomUUID(),
        title: item.title || "Không có tiêu đề",
        content: item.content || item.message || "",
        recipientGroup: normalizedGroup,
        type: item.type || "SYSTEM_ANNOUNCEMENT",
        createdAt: item.createdAt || new Date().toISOString(),
      };
    });
  }, [systemNotificationsData]);

  const allNotifications = useMemo(
    () => [...notifications, ...mappedServerNotifications],
    [mappedServerNotifications, notifications],
  );

  const totalToday = useMemo(() => {
    const today = new Date().toDateString();
    return allNotifications.filter(
      (item) => new Date(item.createdAt).toDateString() === today,
    ).length;
  }, [allNotifications]);

  const resetForm = () => {
    setDraft(emptyDraft);
    setErrors({});
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof NotificationDraft, string>> = {};

    if (!draft.title.trim()) {
      nextErrors.title = "Vui lòng nhập tự đề";
    }

    if (!draft.content.trim()) {
      nextErrors.content = "Vui lòng nhập nội dung";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      await createNotification({
        title: draft.title.trim(),
        content: draft.content.trim(),
        recipientGroup: draft.recipientGroup || "",
        type: "SYSTEM_ANNOUNCEMENT",
      }).unwrap();

      dispatch(
        addToast({
          id: crypto.randomUUID(),
          message: "Tạo thông báo thành công",
          type: "success",
        }),
      );

      closeModal();
    } catch (error) {
      dispatch(
        addToast({
          id: crypto.randomUUID(),
          message: "Tạo thông báo thất bại",
          type: "error",
        }),
      );
    }
  };
  return (
    <div className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-cyan-50 via-white to-orange-50 p-4 sm:p-6 lg:p-8 dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-700/20" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-orange-300/25 blur-3xl dark:bg-orange-700/20" />

      <div className="relative space-y-6">
        <section className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-sm backdrop-blur-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                <Sparkles size={14} />
                ADMIN CONTROL ROOM
              </p>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Xin chào Admin
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Tạo và quản lý thông báo hệ thống nhanh chóng. Nhấn nút bên phải
                để mở modal tạo thông báo mới.
              </p>
            </div>

            <Button
              onClick={openModal}
              icon={Plus}
              label="Tạo thông báo"
              className="self-start md:self-auto"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Tổng thông báo
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              {allNotifications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Tạo trong hôm nay
            </p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
              {totalToday}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Loại mới nhất
            </p>
            <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
              {SYSTEM_ANNOUNCEMENT_LABEL}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mb-4 flex items-center gap-2">
            <BellRing
              size={18}
              className="text-slate-700 dark:text-slate-300"
            />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Danh sách thông báo đã gửi
            </h2>
          </div>

          {allNotifications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Chưa có thông báo nào. Hãy nhấn "Tạo thông báo" để bắt đầu.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {allNotifications.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-amber-200 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                        {SYSTEM_ANNOUNCEMENT_LABEL}
                      </span>
                      <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {recipientGroupLabelMap[item.recipientGroup]}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item.content}
                  </p>

                  <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal open={isModalOpen} onClose={closeModal} width="max-w-xl">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-cyan-100 p-2 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
              <Megaphone size={18} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Tạo thông báo hệ thống
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nhập nội dung và chọn nhóm người nhận trước khi tạo thông báo.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-300">
            Loại thông báo:{" "}
            <span className="font-semibold">Thông báo hệ thống</span>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <Input
              label="Title"
              placeholder="Nhập tiêu đề thông báo"
              value={draft.title}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, title: event.target.value }))
              }
              error={errors.title}
            />

            <Textarea
              label="Content"
              rows={5}
              placeholder="Nhập nội dung thông báo"
              value={draft.content}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, content: event.target.value }))
              }
              error={errors.content}
            />

            <Select
              label="Nhóm nhận thông báo"
              value={draft.recipientGroup}
              options={recipientGroupOptions}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  recipientGroup: event.target
                    .value as NotificationDraft["recipientGroup"],
                }))
              }
            />

            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                label="Huỷ"
              />

              <Button type="submit" label="Tạo thông báo" icon={Plus} />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
