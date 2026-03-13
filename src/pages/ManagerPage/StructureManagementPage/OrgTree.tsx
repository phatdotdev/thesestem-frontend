import type { OrgUnit } from "../../../types/structure";
import { OrgTreeNode } from "./OrgTreeNode";

interface OrgTreeProps {
  roots: OrgUnit[];
}

export const OrgTree = ({ roots }: OrgTreeProps) => {
  return (
    <div className="space-y-10">
      {roots.map((node) => (
        <OrgTreeNode key={node.id} node={node} isRoot />
      ))}
    </div>
  );
};
