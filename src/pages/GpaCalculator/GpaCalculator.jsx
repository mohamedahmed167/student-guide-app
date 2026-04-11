import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  calculateSemesterGPA,
  gpaToPercent,
  getLetterGrade,
} from "../../utils/gpaUtils";
import "./GpaCalculator.css";

/* ── localStorage ─────────────────────────────────────────────────────────── */
const STORAGE_KEY = "gpaCalculatorData";
function loadFromStorage() {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}
function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

/* ── Constants ───────────────────────────────────────────────────────────── */
const GPA_MAX = 5.0;

/* ── GPA level label ─────────────────────────────────────────────────────── */
function getGPALevel(gpa, t) {
  if (gpa >= 3.5) return t("gpa.levels.A");
  if (gpa >= 2.5) return t("gpa.levels.B");
  if (gpa >= 1.5) return t("gpa.levels.C");
  if (gpa >= 1.0) return t("gpa.levels.D");
  return t("gpa.levels.F");
}

/* ── Strategy tip ────────────────────────────────────────────────────────── */
function getStrategyTip(subjects) {
  const valid = subjects.filter(
    (s) => s.name && parseFloat(s.credits) > 0 && s.gradePoints !== "",
  );
  if (!valid.length) return null;
  const weakest = [...valid].sort(
    (a, b) => parseFloat(a.gradePoints) - parseFloat(b.gradePoints),
  )[0];
  const totalCr = valid.reduce((acc, x) => acc + parseFloat(x.credits), 0);
  const boost = (
    ((GPA_MAX - parseFloat(weakest.gradePoints)) *
      parseFloat(weakest.credits)) /
    totalCr
  ).toFixed(2);
  return { subject: weakest.name, credits: weakest.credits, boost };
}

/* ── Row helpers ─────────────────────────────────────────────────────────── */
let _id = 0;
const nextId = () => ++_id;
const makeRow = () => ({
  id: nextId(),
  name: "",
  credits: "3",
  gradePoints: "",
});

const DEFAULT_STATE = {
  subjects: [makeRow()],
};

/* ── Component ───────────────────────────────────────────────────────────── */
export default function GpaCalculator() {
  const { t } = useTranslation();
  const s = loadFromStorage();

  const [subjects, setSubjects] = useState(
    () => s?.subjects ?? DEFAULT_STATE.subjects,
  );

  useEffect(() => {
    saveToStorage({ subjects });
  }, [subjects]);

  /* Derived */
  const semesterGPA = calculateSemesterGPA(subjects);
  const semesterCredits = subjects.reduce(
    (acc, x) => acc + (parseFloat(x.credits) || 0),
    0,
  );
  const currentPct = gpaToPercent(semesterGPA);
  const level = getGPALevel(semesterGPA, t);
  const tip = getStrategyTip(subjects);

  /* Handlers */
  const addRow = () => setSubjects((p) => [...p, makeRow()]);
  const removeRow = useCallback(
    (id) =>
      setSubjects((p) => (p.length === 1 ? p : p.filter((r) => r.id !== id))),
    [],
  );
  const updateRow = useCallback(
    (id, f, v) =>
      setSubjects((p) => p.map((r) => (r.id === id ? { ...r, [f]: v } : r))),
    [],
  );

  return (
    <div className="gpa-page">
      {/* Header */}
      <div className="gpa-page__header">
        <div>
          <span className="gpa-page__badge">{t("gpa.badge")}</span>
          <h1 className="gpa-page__title">{t("gpa.title")}</h1>
          <p className="gpa-page__subtitle">{t("gpa.subtitle")}</p>
        </div>
      </div>

      <div className="gpa-layout">
        {/* Left column */}
        <div className="gpa-left">
          {/* Subjects card */}
          <div className="gpa-card">
            <div className="subjects-header">
              <h2 className="subjects-title">{t("gpa.semesterSubjects")}</h2>
              <button className="add-subject-link" onClick={addRow}>
                <span className="add-subject-link__icon">⊕</span>
                {t("gpa.addSubject")}
              </button>
            </div>
            <div className="subjects-list">
              {subjects.map((subject, index) => (
                <SubjectRow
                  key={subject.id}
                  subject={subject}
                  index={index}
                  onUpdate={updateRow}
                  onRemove={removeRow}
                  t={t}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="gpa-right">
          {/* Estimated GPA */}
          <div className="gpa-card est-card">
            <span className="est-card__label">{t("gpa.estimatedGPA")}</span>
            <div className="est-card__value">{semesterGPA.toFixed(2)}</div>
            <div className="est-card__level">{level}</div>
            <p className="est-card__note">
              {t("gpa.note", { credits: semesterCredits })}
            </p>
          </div>

          {/* Strategy Tip */}
          {tip && (
            <div className="gpa-card tip-card">
              <div className="tip-header">
                <span className="tip-icon">💡</span>
                <span className="tip-title">{t("gpa.strategyTip")}</span>
              </div>
              <p className="tip-text">
                {t("gpa.tipText")
                  .replace("{subject}", tip.subject)
                  .replace("{credits}", tip.credits)
                  .replace("{boost}", tip.boost)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── SubjectRow ───────────────────────────────────────────────────────────── */
const SubjectRow = React.memo(function SubjectRow({
  subject,
  index,
  onUpdate,
  onRemove,
  t,
}) {
  const handlePointsChange = (e) => {
    let val = e.target.value;
    if (val === "") {
      onUpdate(subject.id, "gradePoints", "");
      return;
    }
    const num = parseFloat(val);
    if (num < 0) val = "0";
    if (num > GPA_MAX) val = String(GPA_MAX);
    onUpdate(subject.id, "gradePoints", String(val));
  };

  const points = parseFloat(subject.gradePoints);
  const letter =
    subject.gradePoints === "" || isNaN(points) ? "—" : getLetterGrade(points);

  return (
    <div className="subject-row2">
      <div className="subject-row2__field subject-row2__field--name">
        <label className="subject-row2__label">{t("gpa.subjectName")}</label>
        <input
          className="subject-row2__input"
          type="text"
          placeholder={t("gpa.subjectPlaceholder")}
          value={subject.name}
          onChange={(e) => onUpdate(subject.id, "name", e.target.value)}
        />
      </div>

      <div className="subject-row2__field subject-row2__field--credits">
        <label className="subject-row2__label">{t("gpa.credits")}</label>
        <input
          className="subject-row2__input"
          type="number"
          min="0"
          max="6"
          value={subject.credits}
          onChange={(e) => onUpdate(subject.id, "credits", e.target.value)}
        />
      </div>

      <div className="subject-row2__field subject-row2__field--grade">
        <label className="subject-row2__label">{t("gpa.grade")}</label>
        <div className="subject-row2__points-wrap">
          <input
            className="subject-row2__input subject-row2__input--points"
            type="number"
            min="0"
            max={GPA_MAX}
            step="0.01"
            placeholder={t("gpa.pointsPlaceholder")}
            value={subject.gradePoints}
            onChange={handlePointsChange}
          />
          <span
            className={`subject-row2__letter-badge subject-row2__letter-badge--${letter}`}>
            {letter}
          </span>
        </div>
      </div>

      <button
        className="subject-row2__delete"
        onClick={() => onRemove(subject.id)}
        aria-label="Remove">
        🗑
      </button>
    </div>
  );
});
