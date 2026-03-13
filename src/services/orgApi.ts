import type {
  CollegeProps,
  OrgProps,
  OrgStructureProps,
  ProgramResponse,
  UpdateOrgInfoProps,
} from "../types/organization";
import type { ApiResponse } from "../types/response";
import { api } from "./api";

const ORG_URL = "/orgs";
const COLL_URL = "/colleges";
const FAC_URL = "/faculties";
const DER_URL = "/departments";

const PRO_URL = "/programs";

const YEAR_URL = "/years";
const SEM_URL = "/semesters";

const ROLE_URL = "/councils/roles";

export const orgApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* INFORMATION */
    getOrgInfo: builder.query<ApiResponse<OrgProps>, void>({
      query: () => ({
        url: `${ORG_URL}/mine`,
      }),
    }),
    searchOrgInfoByCode: builder.query<ApiResponse<OrgProps>, string>({
      query: (code) => ({
        url: `${ORG_URL}/search/${code}`,
      }),
    }),
    updateOrgInfo: builder.mutation<ApiResponse<OrgProps>, UpdateOrgInfoProps>({
      query: (data) => ({
        url: `${ORG_URL}/mine/info`,
        method: "PUT",
        body: data,
      }),
    }),
    updateOrgMedia: builder.mutation<ApiResponse<OrgProps>, FormData>({
      query: (data) => ({
        url: `${ORG_URL}/mine/media`,
        method: "PUT",
        body: data,
      }),
    }),
    /* STRUCTURE */
    getOrgStructure: builder.query<ApiResponse<OrgStructureProps>, void>({
      query: () => ({
        url: `${ORG_URL}/mine/structure`,
        method: "GET",
      }),
      providesTags: ["Structure"],
    }),
    /* COLLEGE */
    getColleges: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: `${COLL_URL}`,
      }),
      providesTags: ["Structure"],
    }),
    // ADD COLLEGE
    addCollege: builder.mutation<ApiResponse<CollegeProps>, any>({
      query: (data) => ({
        url: `${COLL_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Structure"],
    }),
    // UPDATE COLLEGE
    updateCollege: builder.mutation<ApiResponse<CollegeProps>, any>({
      query: ({ id, data }) => ({
        url: `${COLL_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Structure"],
    }),
    // DELETE COLLEGE
    deleteCollege: builder.mutation<ApiResponse<void>, any>({
      query: (id) => ({
        url: `${COLL_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Structure"],
    }),
    // ADD FACULTY TO COLLEGE
    addFacultyToCollege: builder.mutation<ApiResponse<CollegeProps>, any>({
      query: ({ id, data }) => ({
        url: `${COLL_URL}/${id}/faculties`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Structure"],
    }),
    /* FACULTY */
    getFaculties: builder.query<ApiResponse<any[]>, void>({
      query: () => ({
        url: `${FAC_URL}`,
      }),
      providesTags: ["Structure"],
    }),
    addFaculty: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: `${FAC_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Structure"],
    }),
    updateFaculty: builder.mutation<ApiResponse<any>, any>({
      query: ({ id, data }) => ({
        url: `${FAC_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Structure"],
    }),
    addDepartmentToFaculty: builder.mutation<ApiResponse<any>, any>({
      query: ({ id, data }) => ({
        url: `${FAC_URL}/${id}/departments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Structure"],
    }),
    deleteFaculty: builder.mutation<ApiResponse<any>, any>({
      query: (id) => ({
        url: `${FAC_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Structure"],
    }),
    /* DEPARTMENT */
    getDeparments: builder.query<ApiResponse<any>, void>({
      query: () => ({
        url: `${DER_URL}`,
      }),
      providesTags: ["Structure"],
    }),
    addDepartment: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: `${DER_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Structure"],
    }),
    updateDepartment: builder.mutation<ApiResponse<any>, any>({
      query: ({ id, data }) => ({
        url: `${DER_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Structure"],
    }),
    deleteDepartment: builder.mutation<ApiResponse<any>, any>({
      query: (id) => ({
        url: `${DER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Structure"],
    }),
    /* PROGRAMS */
    getPrograms: builder.query<ApiResponse<ProgramResponse[]>, void>({
      query: () => ({
        url: `${PRO_URL}`,
      }),
      providesTags: ["Program"],
    }),
    createProgram: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: `${PRO_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Program"],
    }),
    updateProgram: builder.mutation<ApiResponse<any>, any>({
      query: ({ data, id }) => ({
        url: `${PRO_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Program"],
    }),
    deleteProgram: builder.mutation<ApiResponse<any>, any>({
      query: (id) => ({
        url: `${PRO_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Program"],
    }),
    /* ROLES */
    getRoles: builder.query<ApiResponse<any>, any>({
      query: () => ({
        url: `${ROLE_URL}`,
      }),
    }),
    addRole: builder.mutation<ApiResponse<any>, any>({
      query: (data) => ({
        url: `${ROLE_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateRole: builder.mutation<ApiResponse<any>, any>({
      query: ({ id, data }) => ({
        url: `${ROLE_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteRole: builder.mutation<ApiResponse<any>, any>({
      query: (id) => ({
        url: `${ROLE_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    // GET YEARS
    getYears: builder.query<ApiResponse<any[]>, void>({
      query: () => ({
        url: `${YEAR_URL}`,
        method: "GET",
      }),
      providesTags: ["Year"],
    }),
    // ADD YEAR
    addYear: builder.mutation<ApiResponse<any[]>, any>({
      query: (data) => ({
        url: `${YEAR_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Year"],
    }),
    // UPDATE YEAR
    updateYear: builder.mutation<ApiResponse<any[]>, any>({
      query: ({ id, data }) => ({
        url: `${YEAR_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Year"],
    }),
    deleteYear: builder.mutation<ApiResponse<any[]>, any>({
      query: (id) => ({
        url: `${YEAR_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Year"],
    }),
    // GET SEMESTER BY YEAR
    getSemesterByYear: builder.query<ApiResponse<any[]>, any>({
      query: (id) => ({
        url: `${YEAR_URL}/${id}/semesters`,
      }),
    }),
    // ADD SEMESTER
    addSemeseter: builder.mutation<ApiResponse<any[]>, any>({
      query: ({ id, data }) => ({
        url: `${YEAR_URL}/${id}/semesters`,
        method: "POST",
        body: data,
      }),
    }),
    // UPDATE SEMESTER
    updateSemester: builder.mutation<ApiResponse<any[]>, any>({
      query: ({ id, data }) => ({
        url: `${SEM_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    updateSemesterStatus: builder.mutation<ApiResponse<any[]>, any>({
      query: ({ id, status }) => ({
        url: `${SEM_URL}/${id}/status/${status}`,
        method: "PUT",
      }),
    }),
    // DELETE SEMESTER
    deleteSemester: builder.mutation<ApiResponse<any[]>, any>({
      query: (id) => ({
        url: `${SEM_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSearchOrgInfoByCodeQuery,
  useLazySearchOrgInfoByCodeQuery,
  useGetOrgInfoQuery,
  useLazyGetOrgInfoQuery,
  useUpdateOrgInfoMutation,
  useUpdateOrgMediaMutation,
  /* STRUCTURE */
  useGetOrgStructureQuery,
  // COLLEGE
  useGetCollegesQuery,
  useLazyGetCollegesQuery,
  useAddCollegeMutation,
  useUpdateCollegeMutation,
  useAddFacultyToCollegeMutation,
  useDeleteCollegeMutation,
  // FACULTY
  useGetFacultiesQuery,
  useLazyGetFacultiesQuery,
  useAddFacultyMutation,
  useUpdateFacultyMutation,
  useAddDepartmentToFacultyMutation,
  useDeleteFacultyMutation,
  // DEPARTMEMT
  useGetDeparmentsQuery,
  useAddDepartmentMutation,
  useLazyGetDeparmentsQuery,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  /* PROGRAM */
  useGetProgramsQuery,
  useCreateProgramMutation,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
  /* YEARS */
  useGetYearsQuery,
  useAddYearMutation,
  useUpdateYearMutation,
  useDeleteYearMutation,
  /* SEMESTER */
  useLazyGetSemesterByYearQuery,
  useGetSemesterByYearQuery,
  useAddSemeseterMutation,
  useUpdateSemesterMutation,
  useUpdateSemesterStatusMutation,
  useDeleteSemesterMutation,

  /* LECTURERS */
} = orgApi;
