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

/** A single answer option of a created survey. */
export interface CreatedAnswer {
  letter: string;
  text: string;
}

/** A question of a created survey including its answers. */
export interface CreatedQuestion {
  title: string;
  allowMultiple: boolean;
  answers: CreatedAnswer[];
}

/** A survey created through the create-survey dialog. */
export interface CreatedSurvey {
  title: string;
  category: string;
  endDate: string;
  description: string;
  questions: CreatedQuestion[];
}

/** An answer option of a stored survey including its vote counter. */
export interface StoredAnswer {
  letter: string;
  text: string;
  votes: number;
}

/** A question of a stored survey including its answers. */
export interface StoredQuestion {
  title: string;
  allowMultiple: boolean;
  answers: StoredAnswer[];
}

/** A survey persisted in localStorage with live vote tallies. */
export interface StoredSurvey {
  id: string;
  title: string;
  category: string;
  endDate: string;
  description: string;
  questions: StoredQuestion[];
  selections: string[];
  completed: boolean;
}
