export const GRADE_SCALES = [
  { grade: "A", min: 3.5, max: 5.0 },
  { grade: "B", min: 2.5, max: 3.49 },
  { grade: "C", min: 1.5, max: 2.49 },
  { grade: "D", min: 0.5, max: 1.49 },
  { grade: "F", min: 0.0, max: 0.49 },
];

/**
 * Given a numeric point (0–5), return the letter grade.
 */
export function getLetterGrade(points) {
  const p = parseFloat(points);
  if (isNaN(p)) return "—";
  for (const scale of GRADE_SCALES) {
    if (p >= scale.min && p <= scale.max) return scale.grade;
  }
  return "F";
}

/**
 * Calculate semester GPA from subjects using numeric gradePoints (0–5).
 * Formula: Σ(gradePoints × credits) / Σ(credits)
 */
export function calculateSemesterGPA(subjects) {
  let totalPoints = 0;
  let totalCredits = 0;

  subjects.forEach((subject) => {
    const credits = parseFloat(subject.credits) || 0;
    const gradePoints = parseFloat(subject.gradePoints) || 0;
    totalPoints += gradePoints * credits;
    totalCredits += credits;
  });

  if (totalCredits === 0) return 0;
  return Math.round((totalPoints / totalCredits) * 100) / 100;
}

/**
 * Project CGPA after this semester.
 */
export function calculateProjectedCGPA(
  currentCGPA,
  earnedCredits,
  semesterGPA,
  semesterCredits,
) {
  const totalCredits = earnedCredits + semesterCredits;
  if (totalCredits === 0) return 0;
  const projected =
    (currentCGPA * earnedCredits + semesterGPA * semesterCredits) /
    totalCredits;
  return Math.round(projected * 100) / 100;
}

/**
 * Convert a GPA value to a 0–100 percentage for progress bars.
 * Max is 5.0 to match the new scale.
 */
export function gpaToPercent(gpa, max = 5.0) {
  return Math.min((gpa / max) * 100, 100);
}
