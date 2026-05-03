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
      {!isRoot && (
        <>
          <div className="absolute bottom-0 left-0 top-0 w-px bg-slate-300 dark:bg-slate-700" />
          <div className="absolute left-0 top-10 h-px w-6 bg-slate-300 dark:bg-slate-700" />
          <div className="absolute left-0 top-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
        </>
      )}

      <div className={isRoot ? "" : "ml-6 pt-4"}>
        <NodeRenderer node={node} open={open} setOpen={setOpen} />
      </div>

      {open && node.children && node.children?.length > 0 && (
        <div className="relative ml-10 space-y-1">
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
