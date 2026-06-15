/**
 * Type definitions for surveys shown on the home screen.
 */

/** Filter tabs of the survey list. */
export type SurveyFilter = "active" | "past";

/** A single survey as displayed in the lists and cards. */
export interface Survey {
  id: string;
  category: string;
  title: string;
  endsInDays: number;
}
