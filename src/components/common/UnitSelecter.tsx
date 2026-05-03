import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Search,
  Landmark,
  Building,
} from "lucide-react";
import {
  useGetCollegesQuery,
  useGetFacultiesQuery,
  useGetDeparmentsQuery,
} from "../../services/orgApi";

type UnitType = "COLLEGE" | "FACULTY" | "DEPARTMENT";

interface Props {
  size?: "sm" | "md";
  onChange?: (type: UnitType, unitId: string | null) => void;
  value?: { type: UnitType; id: string | null; name?: string } | null;
  showAllOption?: boolean;
  width?: number | string;
  height?: number | string;
}

const OrganizationUnitSelecter = ({
  size = "md",
  onChange,
  value,
  showAllOption = true,
  width,
  height,
}: Props) => {
  const { data: collegesData, isLoading: isLoadingColleges } =
    useGetCollegesQuery();
  const { data: facultiesData, isLoading: isLoadingFaculties } =
    useGetFacultiesQuery();
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useGetDeparmentsQuery();

  const colleges = collegesData?.data || [];
  const faculties = facultiesData?.data || [];
  const departments = departmentsData?.data || [];

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCollege, setExpandedCollege] = useState<string | null>(null);
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);
  const [selected, setSelected] = useState<{
    type: UnitType;
    id: string | null;
    name: string;
  } | null>(
    value
      ? {
          type: value.type,
          id: value.id,
          name: value.name || "",
        }
      : null,
  );
  const triggerHeightClass = size === "sm" ? "h-9" : "h-11";

  const ref = useRef<HTMLDivElement>(null);

  const rootFaculties = useMemo(
    () => faculties.filter((f: any) => !f.college?.id),
    [faculties],
  );
  const rootDepartments = useMemo(
    () => departments.filter((d: any) => !d.faculty?.id && !d.college?.id),
    [departments],
  );

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredColleges = useMemo(
    () =>
      colleges.filter((college: any) => {
        if (!normalizedSearch) return true;
        return (
          `${college.name || ""}`.toLowerCase().includes(normalizedSearch) ||
          `${college.code || ""}`.toLowerCase().includes(normalizedSearch)
        );
      }),
    [colleges, normalizedSearch],
  );

  const filteredRootFaculties = useMemo(
    () =>
      rootFaculties.filter((faculty: any) => {
        if (!normalizedSearch) return true;
        return (
          `${faculty.name || ""}`.toLowerCase().includes(normalizedSearch) ||
          `${faculty.code || ""}`.toLowerCase().includes(normalizedSearch)
        );
      }),
    [rootFaculties, normalizedSearch],
  );

  const filteredRootDepartments = useMemo(
    () =>
      rootDepartments.filter((department: any) => {
        if (!normalizedSearch) return true;
        return (
          `${department.name || ""}`.toLowerCase().includes(normalizedSearch) ||
          `${department.code || ""}`.toLowerCase().includes(normalizedSearch)
        );
      }),
    [rootDepartments, normalizedSearch],
  );

  const handleSelect = (type: UnitType, id: string | null, name: string) => {
    setSelected({ type, id, name });
    onChange?.(type, id);
    setOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    if (value === undefined) return;

    if (!value) {
      setSelected(null);
      return;
    }

    setSelected({
      type: value.type,
      id: value.id,
      name: value.name || "",
    });
  }, [value]);

  const selectedLabel = useMemo(() => {
    if (!selected || selected.id === null) return "Tất cả đơn vị";
    if (selected.name) return selected.name;

    if (selected.type === "COLLEGE") {
      return colleges.find((c: any) => c.id === selected.id)?.name || "Đơn vị";
    }

    if (selected.type === "FACULTY") {
      return faculties.find((f: any) => f.id === selected.id)?.name || "Đơn vị";
    }

    return departments.find((d: any) => d.id === selected.id)?.name || "Đơn vị";
  }, [selected, colleges, faculties, departments]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderSubDepartments = (facultyId: string) => {
    const subDepts = departments.filter(
      (d: any) => d.faculty?.id === facultyId,
    );

    const filtered = subDepts.filter((dept: any) => {
      if (!normalizedSearch) return true;
      return (
        `${dept.name || ""}`.toLowerCase().includes(normalizedSearch) ||
        `${dept.code || ""}`.toLowerCase().includes(normalizedSearch)
      );
    });

    if (filtered.length === 0) return null;

    return (
      <div className="ml-4 mt-1 border-l-2 border-gray-100 dark:border-gray-800 pl-2 space-y-1">
        {filtered.map((dept: any) => (
          <div
            key={dept.id}
            onClick={() => handleSelect("DEPARTMENT", dept.id, dept.name)}
            className="px-3 py-1.5 text-[11px] text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors"
          >
            • {dept.name}
          </div>
        ))}
      </div>
    );
  };

  const hasAnyResult =
    filteredColleges.length > 0 ||
    filteredRootFaculties.length > 0 ||
    filteredRootDepartments.length > 0;
  if (isLoadingDepartments || isLoadingFaculties || isLoadingColleges) {
    return (
      <div
        className={`rounded-xl border border-gray-100 bg-gray-100 dark:border-gray-800 dark:bg-gray-800 animate-pulse ${height ? "" : triggerHeightClass}`}
        style={{ width: width ?? "20rem", height }}
      />
    );
  }
  return (
    <div
      ref={ref}
      className="outline-none border-none relative"
      style={{ width: width ?? "20rem" }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{ height }}
        className={`
          flex items-center justify-between gap-2
          ${size === "sm" ? "px-3" : "px-4"}
          ${height ? "py-0" : size === "sm" ? "py-1.5" : "py-2.5"}
          rounded-xl
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          shadow-sm
          cursor-pointer
          hover:border-blue-400
          transition
        `}
      >
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 overflow-hidden">
          <Building
            size={size === "sm" ? 16 : 20}
            className="text-gray-500 shrink-0"
          />
          <span className="text-sm mt-0.5 font-medium truncate">
            {selectedLabel}
          </span>
        </div>
        <ChevronDown
          size={size === "sm" ? 16 : 20}
          className={`text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div
          className="
          absolute z-20 mt-2 w-full
          rounded-xl
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          shadow-lg
          overflow-hidden
          "
        >
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 pl-9 pr-3 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm nhanh đơn vị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-1.5 custom-scrollbar">
            {showAllOption && !searchTerm && (
              <div
                onClick={() => handleSelect("COLLEGE", null, "Tất cả đơn vị")}
                className={`
                  flex items-center gap-2 px-4 py-2.5
                  text-sm cursor-pointer transition
                  ${
                    !selected
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
              >
                <Globe size={16} />
                <span className="font-medium">Tất cả đơn vị</span>
              </div>
            )}

            {filteredColleges.map((college: any) => (
              <div key={college.id} className="mb-1">
                <div
                  className={`
                    group flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition
                    ${
                      selected?.type === "COLLEGE" && selected.id === college.id
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <span
                    onClick={() =>
                      handleSelect("COLLEGE", college.id, college.name)
                    }
                    className="text-sm font-medium flex-1"
                  >
                    {college.name}
                  </span>
                  <button
                    onClick={() =>
                      setExpandedCollege(
                        expandedCollege === college.id ? null : college.id,
                      )
                    }
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                  >
                    <ChevronRight
                      size={16}
                      className={`text-gray-400 transition-transform ${expandedCollege === college.id ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>

                {expandedCollege === college.id && (
                  <div className="ml-4 mt-1 border-l-2 border-gray-100 dark:border-gray-800 pl-2">
                    {faculties
                      .filter((f: any) => f.college?.id === college.id)
                      .filter((f: any) => {
                        if (!normalizedSearch) return true;
                        return (
                          `${f.name || ""}`
                            .toLowerCase()
                            .includes(normalizedSearch) ||
                          `${f.code || ""}`
                            .toLowerCase()
                            .includes(normalizedSearch)
                        );
                      })
                      .map((faculty: any) => (
                        <div key={faculty.id}>
                          <div
                            className={`
                              group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition
                              ${
                                selected?.type === "FACULTY" &&
                                selected.id === faculty.id
                                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300"
                                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                              }
                            `}
                          >
                            <span
                              onClick={() =>
                                handleSelect(
                                  "FACULTY",
                                  faculty.id,
                                  faculty.name,
                                )
                              }
                              className="text-xs font-medium flex-1"
                            >
                              {faculty.name}
                            </span>
                            <button
                              onClick={() =>
                                setExpandedFaculty(
                                  expandedFaculty === faculty.id
                                    ? null
                                    : faculty.id,
                                )
                              }
                              className="p-1"
                            >
                              <ChevronRight
                                size={14}
                                className={`text-gray-400 transition-transform ${
                                  expandedFaculty === faculty.id
                                    ? "rotate-90"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>
                          {expandedFaculty === faculty.id &&
                            renderSubDepartments(faculty.id)}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}

            {(filteredRootFaculties.length > 0 ||
              filteredRootDepartments.length > 0) && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Đơn vị trực thuộc khác
                </div>

                {filteredRootFaculties.map((f: any) => (
                  <div key={f.id} className="mb-1">
                    <div
                      className={`
                          group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition
                          ${
                            selected?.type === "FACULTY" && selected.id === f.id
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300"
                              : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }
                        `}
                    >
                      <span
                        onClick={() => handleSelect("FACULTY", f.id, f.name)}
                        className="text-xs font-medium flex-1"
                      >
                        {f.name}
                      </span>
                      <button
                        onClick={() =>
                          setExpandedFaculty(
                            expandedFaculty === f.id ? null : f.id,
                          )
                        }
                        className="p-1"
                      >
                        <ChevronRight
                          size={14}
                          className={`text-gray-400 transition-transform ${expandedFaculty === f.id ? "rotate-90" : ""}`}
                        />
                      </button>
                    </div>
                    {expandedFaculty === f.id && renderSubDepartments(f.id)}
                  </div>
                ))}

                {filteredRootDepartments.map((d: any) => (
                  <div
                    key={d.id}
                    onClick={() => handleSelect("DEPARTMENT", d.id, d.name)}
                    className={`
                      px-3 py-2 text-[11px] rounded-lg cursor-pointer flex items-center gap-2 transition
                      ${
                        selected?.type === "DEPARTMENT" && selected.id === d.id
                          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    <Landmark size={14} className="text-gray-400" /> {d.name}
                  </div>
                ))}
              </div>
            )}

            {searchTerm && !hasAnyResult && (
              <div className="px-3 py-8 text-center text-xs text-gray-500 dark:text-gray-400">
                Không tìm thấy đơn vị phù hợp
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationUnitSelecter;
