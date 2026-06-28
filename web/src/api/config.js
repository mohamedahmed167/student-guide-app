import { env } from "../environment/environment";

export const API_BASE_URL = env.baseUrl;

export const LEVEL_LABELS = {
  1: "First Year",
  2: "Second Year",
  3: "Third Year",
  4: "Fourth Year",
  5: "Fifth Year",
};

export const DAY_TO_DATE_OFFSET = {
  saturday: 6,
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
};
