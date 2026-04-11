// src/components/layout/Navbar.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import useStudentStore from "../../store/useStudentStore";
import "./Navbar.css";

const str = (val) =>
  val && typeof val === "object" ? val.name || "" : String(val || "");

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const student = useStudentStore((s) => s.student);
  const displayName = useStudentStore((s) => s.displayName);

  const toggleLanguage = () => {
    const next = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
    document.documentElement.setAttribute("dir", next === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", next);
  };

  const name =
    displayName ||
    localStorage.getItem("studentName") ||
    str(student?.name) ||
    "";
  const rawDept = str(student?.department);

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <header className="navbar">
      <div className="navbar__right">
        <button className="navbar__lang-btn" onClick={toggleLanguage}>
          {t("lang.switch")}
        </button>

        {/* Bell icon — matches reference Profile image
        <button className="navbar__icon-btn" aria-label="Notifications">
          🔔
        </button> */}

        {/* Settings icon — visible in reference Profile image
        <button className="navbar__icon-btn" aria-label="Settings">
          ⚙️
        </button> */}

        {name && (
          <div className="navbar__user">
            <div className="navbar__user-info">
              <span className="navbar__user-name">{name}</span>
              {rawDept && <span className="navbar__user-dept">{rawDept}</span>}
            </div>
            {initials && <div className="navbar__avatar">{initials}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
