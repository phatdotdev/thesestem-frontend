import CollegeCard from "../../components/organization/CollegeCard";

const CollegeManagePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Cơ cấu tổ chức đào tạo</h1>

      <CollegeCard
        college={{
          id: "1",
          name: "Đại học Công Nghệ ABC",
          code: "CIT",
          description: "Đào tạo CNTT & Kỹ thuật",
          faculties: [
            {
              id: "f1",
              name: "Khoa Công Nghệ Thông Tin",
              code: "CNTT",
              majors: [
                { id: "m1", name: "Kỹ thuật phần mềm", code: "SE" },
                { id: "m2", name: "Khoa học máy tính", code: "CS" },
              ],
            },
          ],
        }}
      />
    </div>
  );
};

export default CollegeManagePage;
