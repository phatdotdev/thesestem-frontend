import type {
  CreateRoleRequest,
  RoleResponse,
  UpdateRoleRequest,
} from "../types/organization";
import type { ApiResponse } from "../types/response";

import { api } from "./api";

type CourseProps = {
  id: string;
  code: string;
  name: string;
  startYear?: number;
  endYear?: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
};

const COR_URL = "/courses";
const ROLE_URL = "/councils/roles";
export const catApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /* COURSES*/
    getCourses: builder.query<ApiResponse<CourseProps[]>, void>({
      query: () => ({
        url: `${COR_URL}`,
      }),
    }),
    createCourse: builder.mutation<ApiResponse<CourseProps>, any>({
      query: (data) => ({
        url: `${COR_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateCourse: builder.mutation<ApiResponse<CourseProps>, any>({
      query: ({ id, data }) => ({
        url: `${COR_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCourse: builder.mutation<ApiResponse<CourseProps>, any>({
      query: (id) => ({
        url: `${COR_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    /* ROLES */
    getRoles: builder.query<ApiResponse<RoleResponse[]>, void>({
      query: () => ({
        url: `${ROLE_URL}`,
      }),
    }),
    createRole: builder.mutation<
      ApiResponse<RoleResponse[]>,
      CreateRoleRequest
    >({
      query: (data) => ({
        url: `${ROLE_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateRole: builder.mutation<
      ApiResponse<RoleResponse[]>,
      UpdateRoleRequest
    >({
      query: ({ id, data }) => ({
        url: `${ROLE_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteRole: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${ROLE_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});
export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  /* ROLES */
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = catApi;
