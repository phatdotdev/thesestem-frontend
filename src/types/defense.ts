import type { CouncilMemberResponse, CouncilResponse } from "./council";
import type { ThesisResponse } from "./thesis";

export type DefenseResponse = {
  id: string;
  defenseTime: string;
  location: string;
  thesis: ThesisResponse;
  council: CouncilResponse;
  scores: DefenseScore[];
  member?: DefenseResponse;
};

export type DefenseScore = {
  id: string;
  member: CouncilMemberResponse;
  score: number;
  comment: string;
};
