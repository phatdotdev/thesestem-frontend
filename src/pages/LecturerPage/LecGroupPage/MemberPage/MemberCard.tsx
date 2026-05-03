import { Mail, BookPlus, Pencil, IdCard, BookOpen, Info } from "lucide-react";
import Button from "../../../../components/UI/Button";
import Badge from "../../../../components/UI/Badge";
import type { StudentResponse } from "../../../../types/student";

interface MemberCardProps {
  member: StudentResponse;
  topic?: { title: string };
  onSelect: () => void;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const MemberCard = ({ member, topic, onSelect }: MemberCardProps) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white/95 transition-all duration-200 hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900/95 dark:hover:border-gray-600">
      <div className="flex items-stretch">
        {/* Avatar column */}
        <div className="flex flex-shrink-0 flex-col items-center px-3 pl-4 pt-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(member.fullName)
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 px-4 py-3.5 pl-3">
          {/* Name + action */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                {member.fullName}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <IdCard className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                  {member.studentCode}
                </span>
              </div>
            </div>
            <div>
              {/* Program badge */}
              {member.program?.name && (
                <div className="mb-2.5">
                  <Badge
                    label={member.program.name}
                    size="sm"
                    variant="secondary"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-1.5 mb-2">
            <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {member.email}
            </span>
          </div>

          {/* Topic section */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 dark:border-gray-800">
            <div className="flex items-center gap-1">
              {topic ? (
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-gray-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {topic.title}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                  <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                    Chưa được phân công đề tài
                  </span>
                </div>
              )}
            </div>

            <div className="flex-shrink-0">
              <Button
                size="xs"
                icon={topic ? Pencil : BookPlus}
                variant={topic ? "outline" : "secondary"}
                label={topic ? "Đổi đề tài" : "Phân công đề tài"}
                onClick={onSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
