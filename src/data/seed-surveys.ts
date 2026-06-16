/**
 * Sample surveys used to render the home screen.
 * These are placeholders until real data is connected.
 */

import type { Survey } from "../types/survey";

/**
 * Returns the surveys highlighted in the "ending soon" section.
 * @returns List of soon-ending surveys.
 */
export function getEndingSoonSurveys(): Survey[] {
  return [
    {
      id: "soon-team-event",
      category: "Team Activities",
      title: "Let's Plan the Next Team Event Together",
      endsInDays: 1,
    },
    {
      id: "soon-wellness",
      category: "Health & Wellness",
      title: "Fit & wellness survey!",
      endsInDays: 2,
    },
    {
      id: "soon-gaming",
      category: "Gaming & Entertainment",
      title: "Gaming habits and favorite games!",
      endsInDays: 3,
    },
  ];
}

/**
 * Returns the surveys shown in the active survey list.
 * @returns List of active surveys.
 */
export function getActiveSurveys(): Survey[] {
  return [
    {
      id: "active-team-event",
      category: "Team Activities",
      title: "Let's Plan the Next Team Event Together",
      endsInDays: 1,
    },
    {
      id: "active-gaming-1",
      category: "Gaming & Entertainment",
      title: "Gaming habits and favorite games!",
      endsInDays: 3,
    },
    {
      id: "active-gaming-2",
      category: "Gaming & Entertainment",
      title: "Gaming habits and favorite games!",
      endsInDays: 3,
    },
    {
      id: "active-wellness-1",
      category: "Health & Wellness",
      title: "Healthier future: Fit & wellness survey!",
      endsInDays: 2,
    },
    {
      id: "active-wellness-2",
      category: "Health & Wellness",
      title: "Healthier future: Fit & wellness survey!",
      endsInDays: 2,
    },
    {
      id: "active-team-event-2",
      category: "Team Activities",
      title: "Let's Plan the Next Team Event Together",
      endsInDays: 1,
    },
  ];
}
