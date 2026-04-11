import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useStudent, useUpdateStudent } from "../../hooks/useStudent";
import useStudentStore from "../../store/useStudentStore";
import "./StudentProfile.css";

const str = (val) =>
  val && typeof val === "object" ? val.name || "" : String(val || "");

export default function StudentProfile() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { data: student, isLoading, isError } = useStudent();
  const updateMutation = useUpdateStudent();

  const setDisplayName = useStudentStore((s) => s.setDisplayName);
  const setCoverImage = useStudentStore((s) => s.setCoverImage);
  const setProfileImage = useStudentStore((s) => s.setProfileImage);
  const resetAllImages = useStudentStore((s) => s.resetAllImages);
  const coverImage = useStudentStore((s) => s.coverImage);
  const profileImage = useStudentStore((s) => s.profileImage);
  const displayName = useStudentStore((s) => s.displayName);
  const darkMode = useStudentStore((s) => s.darkMode);
  const toggleDarkMode = useStudentStore((s) => s.toggleDarkMode);

  const [emailAlerts, setEmailAlerts] = useState(
    () => localStorage.getItem("emailAlerts") !== "false",
  );
  const [saveMsg, setSaveMsg] = useState("");

  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (student) {
      const name = localStorage.getItem("studentName") || str(student.name);
      if (!displayName) setDisplayName(name);
      reset({
        name,
        university_id: str(student.university_id || student.id),
        email: str(student.email),
        department: str(student.department),
        academic_year: str(student.academic_year || student.level),
      });
    }
  }, [student, reset]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCoverImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleResetAll = (e) => {
    e.stopPropagation();
    resetAllImages();
  };

  const onSubmit = async (formData) => {
    try {
      await updateMutation.mutateAsync(formData);
      setDisplayName(formData.name);
      setSaveMsg("ok");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("err");
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  const toggleEmailAlerts = () => {
    const next = !emailAlerts;
    setEmailAlerts(next);
    localStorage.setItem("emailAlerts", String(next));
  };

  if (isLoading) {
    return (
      <div className="sp-page">
        <div className="sp-skeleton">
          <div className="sk sk--cover" />
          <div className="sk sk--avatar" />
          <div className="sk sk--line" />
          <div className="sk sk--line sk--short" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="sp-page">
        <p className="sp-error">
          Could not load student data. Please check your connection.
        </p>
      </div>
    );
  }

  const name = displayName || str(student?.name) || "—";
  const rawDept = str(student?.department);
  const rawYear = str(student?.academic_year || student?.level);

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "JD";

  /* Field class helpers */
  const labelCls = isRTL
    ? "sp-field__label sp-field__label--ar"
    : "sp-field__label";
  const inputCls = isRTL
    ? "sp-field__input sp-field__input--ar"
    : "sp-field__input";

  return (
    <div className="sp-page">
      {/* ── Cover ──────────────────────────────────────────────────── */}
      <section className="sp-hero">
        <div
          className="sp-cover"
          style={
            coverImage
              ? {
                  backgroundImage: `url(${coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {}
          }
          onClick={() => coverInputRef.current?.click()}>
          {(coverImage || profileImage) && (
            <button
              className="sp-cover__reset"
              type="button"
              onClick={handleResetAll}>
              {t("profile.resetCover")}
            </button>
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleCoverChange}
          />
        </div>

        {/* Avatar — always left-anchored */}
        <div className="sp-hero__identity">
          <div className="sp-avatar-wrap">
            <div className="sp-avatar">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="sp-avatar__img"
                />
              ) : (
                initials
              )}
            </div>
            <button
              className="sp-avatar__edit-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                profileInputRef.current?.click();
              }}
              title="Change profile photo">
              ✏
            </button>
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfileImageChange}
            />
          </div>

          <div className="sp-hero__name-card">
            <h2 className="sp-hero__name">{name}</h2>
            <p className="sp-hero__meta">{rawDept || "—"}</p>
            {rawYear && <p className="sp-hero__year">{rawYear}</p>}
          </div>
        </div>
      </section>

      {/* ── Content — single column for personal info + preferences ── */}
      <div className={`sp-content ${isRTL ? "sp-content--rtl" : ""}`}>
        {/* Personal Information */}
        <div className="sp-card">
          <div
            className={`sp-form-header ${isRTL ? "sp-form-header--rtl" : ""}`}>
            <div className={isRTL ? "text-right" : ""}>
              <h3 className="sp-form-title">{t("profile.personalInfo")}</h3>
              <p className="sp-form-subtitle">
                {t("profile.personalSubtitle")}
              </p>
            </div>
            <button
              className="sp-save-btn"
              onClick={handleSubmit(onSubmit)}
              disabled={updateMutation.isPending}>
              {updateMutation.isPending
                ? t("profile.saving")
                : t("profile.saveChanges")}
            </button>
          </div>

          {saveMsg === "ok" && (
            <div className="sp-toast sp-toast--ok">{t("profile.saveOk")}</div>
          )}
          {saveMsg === "err" && (
            <div className="sp-toast sp-toast--err">{t("profile.saveErr")}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="sp-form-grid">
              <div className="sp-field">
                <label className={labelCls}>{t("profile.fullName")}</label>
                <div
                  className={`sp-field__wrap ${isRTL ? "sp-field__wrap--rtl" : ""}`}>
                  <span
                    className={`sp-field__icon ${isRTL ? "sp-field__icon--rtl" : ""}`}>
                    👤
                  </span>
                  <input
                    className={`${inputCls} ${errors.name ? "sp-field__input--err" : ""}`}
                    {...register("name", { required: true })}
                  />
                </div>
              </div>

              <div className="sp-field">
                <label className={labelCls}>{t("profile.universityId")}</label>
                <div
                  className={`sp-field__wrap sp-field__wrap--readonly ${isRTL ? "sp-field__wrap--rtl" : ""}`}>
                  <span
                    className={`sp-field__icon ${isRTL ? "sp-field__icon--rtl" : ""}`}>
                    🪪
                  </span>
                  <input
                    className={inputCls}
                    disabled
                    {...register("university_id")}
                  />
                </div>
              </div>

              <div className="sp-field sp-field--full">
                <label className={labelCls}>{t("profile.email")}</label>
                <div
                  className={`sp-field__wrap ${isRTL ? "sp-field__wrap--rtl" : ""}`}>
                  <span
                    className={`sp-field__icon ${isRTL ? "sp-field__icon--rtl" : ""}`}>
                    ✉
                  </span>
                  <input
                    className={inputCls}
                    type="email"
                    {...register("email")}
                  />
                </div>
              </div>

              <div className="sp-field">
                <label className={labelCls}>{t("profile.department")}</label>
                <div
                  className={`sp-field__wrap sp-field__wrap--readonly ${isRTL ? "sp-field__wrap--rtl" : ""}`}>
                  <span
                    className={`sp-field__icon ${isRTL ? "sp-field__icon--rtl" : ""}`}>
                    🏛
                  </span>
                  <input
                    className={inputCls}
                    disabled
                    {...register("department")}
                  />
                </div>
              </div>

              <div className="sp-field">
                <label className={labelCls}>{t("profile.academicYear")}</label>
                <div
                  className={`sp-field__wrap ${isRTL ? "sp-field__wrap--rtl" : ""}`}>
                  <span
                    className={`sp-field__icon ${isRTL ? "sp-field__icon--rtl" : ""}`}>
                    📅
                  </span>
                  <input className={inputCls} {...register("academic_year")} />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Portal Preferences */}
        <div className="sp-card">
          <h3 className={`sp-pref-title ${isRTL ? "text-right" : ""}`}>
            {t("profile.preferences")}
          </h3>
          <div className="sp-prefs">
            <div className={`sp-pref ${isRTL ? "sp-pref--rtl" : ""}`}>
              <div className="sp-pref__icon-wrap sp-pref__icon-wrap--primary">
                🌙
              </div>
              <div className={`sp-pref__text ${isRTL ? "text-right" : ""}`}>
                <span
                  className={`sp-pref__name ${isRTL ? "sp-pref__name--ar" : ""}`}>
                  {t("profile.darkMode")}
                </span>
                <span
                  className={`sp-pref__desc ${isRTL ? "sp-pref__desc--ar" : ""}`}>
                  {t("profile.darkModeDesc")}
                </span>
              </div>
              <button
                className={`sp-toggle ${darkMode ? "sp-toggle--on" : ""}`}
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode">
                <span className="sp-toggle__thumb" />
              </button>
            </div>

            <div className={`sp-pref ${isRTL ? "sp-pref--rtl" : ""}`}>
              <div className="sp-pref__icon-wrap sp-pref__icon-wrap--secondary">
                🔔
              </div>
              <div className={`sp-pref__text ${isRTL ? "text-right" : ""}`}>
                <span
                  className={`sp-pref__name ${isRTL ? "sp-pref__name--ar" : ""}`}>
                  {t("profile.emailAlerts")}
                </span>
                <span
                  className={`sp-pref__desc ${isRTL ? "sp-pref__desc--ar" : ""}`}>
                  {t("profile.emailAlertsDesc")}
                </span>
              </div>
              <button
                className={`sp-toggle ${emailAlerts ? "sp-toggle--on sp-toggle--green" : ""}`}
                onClick={toggleEmailAlerts}
                aria-label="Toggle email alerts">
                <span className="sp-toggle__thumb" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
