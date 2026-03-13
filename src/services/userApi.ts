import { api } from "./api";
import type { ApiResponse, PageResponse } from "../types/response";
import type {
  CreateStudentRequest,
  MentorSearchForm,
  StudentResponse,
  StudentSearchForm,
  UpdateStudentRequest,
} from "../types/student";
import type {
  AddLecturerRequest,
  LecturerResponse,
  UpdateLecturerRequest,
} from "../types/lecturer";
import type {
  CreateManagerRequest,
  ManagerResponse,
  UpdateManagerRequest,
} from "../types/user";

const STD_URL = "/users/students";
const LEC_URL = "/users/lecturers";
const MGR_URL = "/users/managers";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* STUDENTS */
    // GET STUDENTS
    getStudents: builder.query<ApiResponse<StudentResponse[]>, void>({
      query: () => ({
        url: `${STD_URL}`,
      }),
      providesTags: ["Student"],
    }),
    // SEARCH STUDENTS
    searchStudents: builder.query<
      ApiResponse<PageResponse<StudentResponse>>,
      StudentSearchForm
    >({
      query: (form) => ({
        url: `${STD_URL}/search`,
        params: form,
      }),
      providesTags: ["Student"],
    }),
    // ADD STUDENTS
    addStudent: builder.mutation<
      ApiResponse<StudentResponse>,
      CreateStudentRequest
    >({
      query: (data) => ({
        url: `${STD_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),
    // UPDATE STUDENT
    updateStudent: builder.mutation<ApiResponse<StudentResponse>, any>({
      query: ({ id, data }) => ({
        url: `${STD_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),
    // DELETE STUDENT
    deleteStudent: builder.mutation<ApiResponse<StudentResponse>, any>({
      query: (id) => ({
        url: `${STD_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student"],
    }),
    // GET STUDENT PROFILE
    getStudentProfile: builder.query<ApiResponse<StudentResponse>, void>({
      query: () => ({
        url: `${STD_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["Student"],
    }),
    // UPDATE STUDENT PROFILE
    updateStudentProfile: builder.mutation<
      ApiResponse<StudentResponse>,
      UpdateStudentRequest
    >({
      query: (data) => ({
        url: `${STD_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),
    // UPLOAD STUDENT AVATAR
    updateStudentAvatar: builder.mutation<
      ApiResponse<StudentResponse>,
      FormData
    >({
      query: (data) => ({
        url: `${STD_URL}/profile/avatar`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),
    /* LECTURERS */
    // GET LECTURERS
    getLecturers: builder.query<ApiResponse<LecturerResponse[]>, any>({
      query: (form) => ({
        url: `${LEC_URL}`,
        params: form,
      }),
      providesTags: ["Lecturer"],
    }),
    searchLecturers: builder.query<
      ApiResponse<PageResponse<LecturerResponse>>,
      MentorSearchForm
    >({
      query: (form) => ({
        url: `${LEC_URL}/search`,
        params: form,
      }),
    }),
    // ADD LECTURER
    addLecturer: builder.mutation<
      ApiResponse<LecturerResponse>,
      AddLecturerRequest
    >({
      query: (data) => ({
        url: `${LEC_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lecturer"],
    }),
    // UPDATE LECTURER
    updateLecturer: builder.mutation<
      ApiResponse<LecturerResponse>,
      { id: string; data: UpdateLecturerRequest }
    >({
      query: ({ id, data }) => ({
        url: `${LEC_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Lecturer"],
    }),
    // DELETE LECTURER
    deleteLecturer: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${LEC_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lecturer"],
    }),
    // GET LECTURER PROFILE
    getLecturerProfile: builder.query<ApiResponse<LecturerResponse>, void>({
      query: () => ({
        url: `${LEC_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["Lecturer"],
    }),
    // UPDATE STUDENT PROFILE
    updateLecturerProfile: builder.mutation<
      ApiResponse<StudentResponse>,
      UpdateStudentRequest
    >({
      query: (data) => ({
        url: `${STD_URL}/profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Lecturer"],
    }),
    // UPLOAD STUDENT AVATAR
    updateLecturerAvatar: builder.mutation<
      ApiResponse<StudentResponse>,
      FormData
    >({
      query: (data) => ({
        url: `${LEC_URL}/profile/avatar`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Lecturer"],
    }),
    /* MANAGERS */
    searchManagers: builder.query({
      query: (form) => ({
        url: `${MGR_URL}`,
        method: "GET",
        params: form,
      }),
      providesTags: ["Manager"],
    }),
    createManager: builder.mutation<
      ApiResponse<ManagerResponse>,
      CreateManagerRequest
    >({
      query: (data) => ({
        url: `${MGR_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Manager"],
    }),
    updateManager: builder.mutation<
      ApiResponse<ManagerResponse>,
      UpdateManagerRequest
    >({
      query: ({ id, data }) => ({
        url: `${MGR_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Manager"],
    }),
  }),
});

export const {
  /* STUDENT */
  useGetStudentsQuery,
  useSearchStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentProfileQuery,
  useUpdateStudentProfileMutation,
  useUpdateStudentAvatarMutation,
  /* LECTURER */
  useGetLecturersQuery,
  useSearchLecturersQuery,
  useAddLecturerMutation,
  useUpdateLecturerMutation,
  useDeleteLecturerMutation,
  useGetLecturerProfileQuery,
  useUpdateLecturerAvatarMutation,
  useUpdateLecturerProfileMutation,
  /* MANAGER */
  useSearchManagersQuery,
  useCreateManagerMutation,
  useUpdateManagerMutation,
} = userApi;
