import { CollegeCard } from "./CollegeCard";
import { FacultyCard } from "./FacultyCard";
import { DepartmentCard } from "./DepartmentCard";
import type { OrgUnit } from "../../../types/structure";
import { useState } from "react";

interface OrgTreeNodeProps {
  node: OrgUnit;
  isRoot?: boolean;
}

export const OrgTreeNode = ({ node, isRoot }: OrgTreeNodeProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      {/* Line chỉ vẽ nếu KHÔNG phải root */}
      {!isRoot && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300" />
          <div className="absolute left-0 top-10 w-6 h-px bg-gray-300" />
          <div className="absolute left-0 top-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-400 ring-2 ring-white" />
        </>
      )}

      <div className={isRoot ? "" : "ml-6 pt-4"}>
        <NodeRenderer node={node} open={open} setOpen={setOpen} />
      </div>

      {open && node.children && node.children?.length > 0 && (
        <div className="relative ml-10">
          {node.children.map((child) => (
            <div key={child.id}>
              <OrgTreeNode node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NodeRenderer = ({
  node,
  open,
  setOpen,
}: {
  node: OrgUnit;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  switch (node.type) {
    case "COLLEGE":
      return <CollegeCard college={node} open={open} setOpen={setOpen} />;
    case "FACULTY":
      return <FacultyCard faculty={node} open={open} setOpen={setOpen} />;
    case "DEPARTMENT":
      return <DepartmentCard department={node} />;
    default:
      return null;
  }
};
