import type { ApiResponse } from "../types/response";
import type { SuggestThesisResponse } from "../types/thesis";
import { api } from "./api";

const LLM_URL = "/llm";
const EMB_URL = "/embeddings";

const llmApi = api.injectEndpoints({
  endpoints: (build) => ({
    analyzeFile: build.mutation<
      ApiResponse<string>,
      { fileId: string; userPrompt: string }
    >({
      query: ({ fileId, userPrompt }) => ({
        url: `${LLM_URL}/file`,
        method: "POST",
        body: { fileId, userPrompt },
      }),
    }),
    asyncThesisEmbedding: build.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: `${EMB_URL}/theses/sync`,
        method: "POST",
      }),
      invalidatesTags: ["Thesis"],
    }),
    suggestThesis: build.mutation<
      ApiResponse<SuggestThesisResponse>,
      { thesisId: string }
    >({
      query: ({ thesisId }) => ({
        url: `${LLM_URL}/theses-suggestion/${thesisId}`,
        method: "POST",
      }),
    }),
    adviseSemester: build.mutation<
      ApiResponse<string>,
      { semesterId: string; userPrompt: string }
    >({
      query: ({ semesterId, userPrompt }) => ({
        url: `${LLM_URL}/semester-advise`,
        method: "POST",
        body: { id: semesterId, userPrompt },
      }),
    }),
  }),
});

export const {
  useAnalyzeFileMutation,
  useAsyncThesisEmbeddingMutation,
  useSuggestThesisMutation,
  useAdviseSemesterMutation,
} = llmApi;
