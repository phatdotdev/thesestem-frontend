import { Mail, User, BookPlus, IdCard } from "lucide-react";
import Button from "../../../../components/UI/Button";
import Badge from "../../../../components/UI/Badge";
import type { StudentResponse } from "../../../../types/student";

interface MemberCardProps {
  member: StudentResponse;
  topic?: { title: string };
  onSelect: () => void;
}

const MemberCard = ({ member, topic, onSelect }: MemberCardProps) => {
  return (
    <div className="flex justify-between border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 transition">
      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar */}
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt={member.fullName}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-gray-500" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 space-y-1">
          <p className="font-medium text-gray-900 truncate">
            {member.fullName}
          </p>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <IdCard className="h-3.5 w-3.5" />
            <span className="truncate">{member.studentCode}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Mail className="h-3.5 w-3.5" />
            <span className="truncate">{member.email}</span>
          </div>

          {/* Program */}
          {member.program?.name && (
            <Badge label={member.program.name} size="sm" />
          )}
        </div>
      </div>

      {/* ACTION */}
      <div className="self-end flex justify-end items-center gap-1 p-2">
        {topic ? <Badge label={topic.title} size="sm" /> : null}
        <Button
          size="xs"
          icon={BookPlus}
          label={!!topic ? "Đổi đề tài" : "Phân công đề tài"}
          onClick={onSelect}
        />
      </div>
    </div>
  );
};

export default MemberCard;
