import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useStudentStore from "../../store/useStudentStore";
import "./Sidebar.css";

const NAV_ITEMS = [
  { key: "gpaCalculator", icon: "analytics", path: "/gpa-calculator" },
  { key: "profile", icon: "person", path: "/profile" },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const displayName = useStudentStore((s) => s.displayName);
  const student = useStudentStore((s) => s.student);

  const str = (val) =>
    val && typeof val === "object" ? val.name || "" : String(val || "");

  const name = displayName || str(student?.name) || "Student";
  const rawId = str(student?.university_id || student?.id);
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon">
          <span className="sidebar__brand-icon-glyph">🎓</span>
        </div>
        <h1 className="sidebar__brand-text">Student Guide</h1>
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
        {NAV_ITEMS.map(({ key, path }) => (
          <NavLink
            key={key}
            to={path}
            className={({ isActive }) =>
              `sidebar__link${isActive ? " sidebar__link--active" : ""}`
            }>
            <span className="sidebar__link-icon">
              {key === "gpaCalculator" ? "" : ""}
            </span>
            <span>{t(`nav.${key}`)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Student card at bottom */}
      <div className="sidebar__footer">
        <div className="sidebar__student">
          <div className="sidebar__student-avatar">{initials}</div>
          <div className="sidebar__student-info">
            <span className="sidebar__student-name">{name}</span>
            {rawId && <span className="sidebar__student-id">ID: {rawId}</span>}
          </div>
        </div>
      </div>
    </aside>
  );
}
