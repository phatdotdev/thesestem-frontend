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
    /* =========================================================
                            SEMESTERS
    ========================================================= */

    getSemesters: builder.query<ApiResponse<SemesterResponse[]>, void>({
      query: () => ({
        url: SEM_URL,
      }),
      providesTags: ["Semester"],
    }),

    getCurrentSemester: builder.query<ApiResponse<SemesterResponse>, void>({
      query: () => ({
        url: `${SEM_URL}/current`,
      }),
      providesTags: ["Semester"],
    }),

    /* =========================================================
                            STUDENTS
    ========================================================= */

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

    /* =========================================================
                            MENTORS
    ========================================================= */

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
      providesTags: ["SemesterMentor"],
    }),

    /* =========================================================
                            REGISTER
    ========================================================= */

    createMentorRegister: builder.mutation<ApiResponse<RegisterResposne>, any>({
      query: (data) => ({
        url: REG_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Register"],
    }),

    getMentorRegisters: builder.query<ApiResponse<RegisterResposne[]>, void>({
      query: () => ({
        url: `${REG_URL}/mentor`,
      }),
      providesTags: ["Register"],
    }),

    getStudentRegisters: builder.query<ApiResponse<RegisterResposne[]>, void>({
      query: () => ({
        url: `${REG_URL}/student`,
      }),
      providesTags: ["Register"],
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
      invalidatesTags: ["Register"],
    }),

    /* =========================================================
                            COUNCILS
    ========================================================= */

    searchCurrentCouncils: builder.query<
      ApiResponse<PageResponse<CouncilResponse>>,
      any
    >({
      query: (form) => ({
        url: `${COUN_URL}/current/search`,
        params: form,
      }),
      providesTags: ["Council"],
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
      invalidatesTags: ["Council"],
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
      invalidatesTags: ["Council"],
    }),

    deleteCouncil: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${COUN_URL}/current/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Council"],
    }),
  }),
});

export const {
  useGetSemestersQuery,
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
