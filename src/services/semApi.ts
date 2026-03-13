import type {
  CouncilResponse,
  CreateCouncilRequest,
  UpdateCouncilRequest,
} from "../types/council";
import type { LecturerResponse } from "../types/lecturer";
import type { SemesterResponse } from "../types/organization";
import type { RegisterResposne } from "../types/register";
import type { ApiResponse, PageResponse } from "../types/response";
import type { StudentResponse, StudentSearchForm } from "../types/student";
import { api } from "./api";

const SEM_URL = "/semesters";
const REG_URL = "/registers";
const COUN_URL = "/councils";

export const semApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* SEMESTERS */
    getCurrentSemester: builder.query<ApiResponse<SemesterResponse>, void>({
      query: () => ({
        url: `${SEM_URL}/current`,
      }),
    }),
    /* STUDENTS */
    getThesisStudent: builder.query<
      ApiResponse<StudentResponse[]>,
      StudentSearchForm
    >({
      query: (form) => ({
        url: `${SEM_URL}/current/students`,
        params: form,
      }),
      providesTags: ["SemesterStudent"],
    }),
    searchThesisStudents: builder.query<
      ApiResponse<PageResponse<StudentResponse>>,
      StudentSearchForm
    >({
      query: (form) => ({
        url: `${SEM_URL}/current/students/search`,
        params: form,
      }),
      providesTags: ["SemesterStudent"],
    }),
    addStudentToCurrentSemester: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `${SEM_URL}/current/students/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["SemesterStudent"],
    }),
    removeStudentFromCurrentSemester: builder.mutation<
      ApiResponse<null>,
      string
    >({
      query: (id) => ({
        url: `${SEM_URL}/current/students/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SemesterStudent"],
    }),
    /* MENTORS */
    getThesisMentors: builder.query<
      ApiResponse<LecturerResponse[]>,
      StudentSearchForm
    >({
      query: (form) => ({
        url: `${SEM_URL}/current/mentors`,
        params: form,
      }),
      providesTags: ["SemesterMentor"],
    }),
    searchThesisMentors: builder.query<
      ApiResponse<PageResponse<LecturerResponse>>,
      StudentSearchForm
    >({
      query: (form) => ({
        url: `${SEM_URL}/current/mentors/search`,
        params: form,
      }),
      providesTags: ["SemesterMentor"],
    }),
    addMentorToCurrentSemester: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `${SEM_URL}/current/mentors`,
        method: "PUT",
        body: `"${id}"`,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["SemesterMentor"],
    }),
    removeMentorFromCurrentSemester: builder.mutation<
      ApiResponse<null>,
      string
    >({
      query: (id) => ({
        url: `${SEM_URL}/current/mentors`,
        method: "DELETE",
        body: `"${id}"`,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["SemesterMentor"],
    }),
    checkMentorInCurrentSemester: builder.query<ApiResponse<boolean>, void>({
      query: () => ({
        url: `${SEM_URL}/current/mentors/me`,
      }),
    }),
    /* REGISTER */
    createMentorRegister: builder.mutation<ApiResponse<RegisterResposne>, any>({
      query: (data) => ({
        url: `${REG_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getMentorRegisters: builder.query<ApiResponse<RegisterResposne[]>, void>({
      query: () => ({
        url: `${REG_URL}/mentor`,
      }),
    }),
    getStudentRegisters: builder.query<ApiResponse<RegisterResposne[]>, void>({
      query: () => ({
        url: `${REG_URL}/student`,
      }),
    }),
    updateRegisterRequestStatus: builder.mutation<
      ApiResponse<RegisterResposne>,
      any
    >({
      query: ({ id, data }) => ({
        url: `${REG_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    /* COUNCILS */
    searchCurrentCouncils: builder.query<
      ApiResponse<PageResponse<CouncilResponse>>,
      any
    >({
      query: (form) => ({
        url: `${COUN_URL}/current/search`,
        params: form,
      }),
    }),
    createCouncil: builder.mutation<
      ApiResponse<CouncilResponse>,
      CreateCouncilRequest
    >({
      query: (data) => ({
        url: `${COUN_URL}/current`,
        method: "POST",
        body: data,
      }),
    }),
    updateCouncil: builder.mutation<
      ApiResponse<CouncilResponse>,
      UpdateCouncilRequest
    >({
      query: ({ id, data }) => ({
        url: `${COUN_URL}/current/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCouncil: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${COUN_URL}/current/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCurrentSemesterQuery,
  /* STUDENTS */
  useGetThesisStudentQuery,
  useSearchThesisStudentsQuery,
  useAddStudentToCurrentSemesterMutation,
  useRemoveStudentFromCurrentSemesterMutation,
  /* MENTORS */
  useGetThesisMentorsQuery,
  useSearchThesisMentorsQuery,
  useAddMentorToCurrentSemesterMutation,
  useRemoveMentorFromCurrentSemesterMutation,
  useCheckMentorInCurrentSemesterQuery,
  /* GROUPS */
  /* REGISTERS */
  useCreateMentorRegisterMutation,
  useGetMentorRegistersQuery,
  useGetStudentRegistersQuery,
  useUpdateRegisterRequestStatusMutation,
  /* COUNCILS */
  useSearchCurrentCouncilsQuery,
  useCreateCouncilMutation,
  useUpdateCouncilMutation,
  useDeleteCouncilMutation,
} = semApi;
