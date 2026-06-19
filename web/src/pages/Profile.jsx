import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../context/context';
import { getDepartments, updateProfile as updateProfileApi, yearLabelToLevel } from '../api';
import SideBar from '../compontents/SideBar';
import NotificationBell from '../compontents/NotificationBell';
import { FaPen, FaCheckCircle, FaUser, FaBuilding } from "react-icons/fa";
import { FaFileLines } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import {
  IoCalendarOutline,
  IoSettingsOutline,
  IoChevronDownOutline,
  IoDownloadOutline,
  IoIdCardOutline,
  IoLogOutOutline
} from "react-icons/io5";

const getProfileFormData = (userData) => ({
  name: userData?.name || "",
  email: userData?.email || "",
  department: userData?.department || "",
  year: userData?.year || ""
});

export default function Profile() {
  const { userData, isloggedIn, apiLoading, refreshFromApi, updateProfile, logoutUser } = useContext(userContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState(() => getProfileFormData(userData));
  const profileData = isEditing ? formData : getProfileFormData(userData);

  useEffect(() => {
    if (!apiLoading && !isloggedIn) {
      navigate("/login", { replace: true });
    }
  }, [apiLoading, isloggedIn, navigate]);

  useEffect(() => {
    getDepartments()
      .then(setDepartments)
      .catch((err) => console.warn("Could not load departments:", err.message));
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSave = async () => {
    if (!isEditing) {
      setFormData(getProfileFormData(userData));
      setIsEditing(true);
      return;
    }

    setIsSaving(true);

    try {
      await updateProfileApi({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        currentLevel: yearLabelToLevel(formData.year),
      });
      updateProfile(formData);
      await refreshFromApi();
      setIsEditing(false);
    } catch (err) {
      console.log(err)
    } finally {
      setIsSaving(false);
    }
  };

  const initials = profileData.name
    ? profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : "";
  const gpaDisplay = userData?.targetGpa !== undefined && userData?.targetGpa !== null ? Number(userData.targetGpa).toFixed(2) : "--";
  const creditsDisplay = userData?.credits !== undefined && userData?.credits !== null ? userData.credits : "--";

  if (apiLoading && !userData) {
    return (
      <div className="flex min-h-screen bg-[#F5F5FA] font-sans text-left" dir="ltr">
        <div className="hidden lg:block">
          <SideBar />
        </div>
        <div className="flex-1 p-4 sm:p-6 lg:p-10 flex items-center justify-center text-[#7F8A9E] font-bold">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5FA] font-sans text-left" dir="ltr">
      <div className="hidden lg:block">
        <SideBar />
      </div>
      <div className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-10 overflow-y-auto">

        {/* Top Header */}
        <div className="flex flex-wrap justify-end items-center gap-3 sm:gap-6 mb-6 sm:mb-8 text-[#7F8A9E]">
          <NotificationBell size={24} />
          <IoSettingsOutline size={24} className="cursor-pointer hover:text-[#1D214E] transition-colors" />
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white border border-[#EBEBF2] text-[#7F8A9E] hover:text-[#D64F5D] hover:bg-[#FFF5F6] hover:border-[#FADCDD] transition-all duration-200 font-bold text-[13px] shadow-[0_2px_10px_rgba(0,0,0,0.01)] cursor-pointer disabled:opacity-60"
          >
            <IoLogOutOutline size={18} />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Banner & Avatar Section */}
        <div className="relative mb-8 sm:mb-24">
          {/* Banner */}
          <div className="h-[130px] sm:h-[170px] lg:h-[200px] w-full rounded-[18px] sm:rounded-[24px] bg-gradient-to-r from-[#5C6CE1] to-[#80DFE6] shadow-md"></div>

          {/* Avatar Area */}
          <div className="relative sm:absolute sm:-bottom-16 sm:left-8 lg:left-12 -mt-12 sm:mt-0 px-3 sm:px-0 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-[120px] sm:h-[120px] lg:w-[140px] lg:h-[140px] rounded-full bg-[#8758FF] border-[5px] sm:border-[6px] border-[#F5F5FA] flex items-center justify-center shadow-lg">
                <span className="text-[32px] sm:text-[42px] lg:text-[48px] font-bold text-white tracking-widest">{initials}</span>
              </div>
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-8 h-8 sm:w-10 sm:h-10 bg-[#2D439A] rounded-full border-[3px] border-[#F5F5FA] flex items-center justify-center text-white cursor-pointer shadow-sm hover:bg-[#1d2d70] transition-colors">
                <FaPen size={13} />
              </div>
            </div>

            <div className="w-full sm:w-auto bg-white rounded-2xl px-5 sm:px-8 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] sm:mb-2 relative text-center sm:text-left">
              <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold text-[#1D214E] tracking-tight leading-tight mb-2 break-words">{profileData.name}</h1>
              <p className="text-[#7F8A9E] text-[13px] sm:text-[15px] font-medium break-words">
                {[profileData.department, profileData.year, userData?.role].filter(Boolean).join(" • ")}
              </p>
            </div>
          </div>
        </div>

        {/* Content Grids */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">

          {/* Left Column */}
          <div className="order-2 xl:order-1 xl:col-span-4 space-y-6 lg:space-y-8">

            {/* Academic Status */}
            <div className="bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3 mb-6">
                <FaCheckCircle className="text-[#4E58CA] text-xl" />
                <h3 className="text-[18px] font-bold text-[#1D214E]">Academic Status</h3>
              </div>

              <div className="bg-[#F3F0FA] rounded-2xl p-4 sm:p-5 flex justify-between items-center gap-4 mb-4">
                <span className="text-[#64617A] text-[14px] font-bold">Current GPA</span>
                <span className="text-[#4E58CA] text-[24px] sm:text-[28px] font-bold leading-none">{gpaDisplay}</span>
              </div>

              <div className="bg-[#FFF8E7] rounded-2xl p-4 sm:p-5 flex justify-between items-center gap-4 border border-[#FDEBCC]">
                <span className="text-[#A16F0F] text-[14px] font-bold">Credits Earned</span>
                <span className="text-[#B07B18] text-[22px] sm:text-[24px] font-bold leading-none">{creditsDisplay}</span>
              </div>
            </div>

            {/* Quick Documents */}
            <div className="bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
              <h3 className="text-[18px] font-bold text-[#1D214E] mb-6">Quick Documents</h3>

              <button className="w-full bg-[#F3F6FF] rounded-2xl p-4 flex items-center justify-center sm:justify-start gap-4 mb-4 hover:bg-[#ebeeff] transition-colors group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#4E58CA]">
                  <IoDownloadOutline size={20} className="group-hover:-translate-y-1 transition-transform" />
                </div>
                <span className="text-[#4E58CA] text-[13px] font-bold tracking-widest text-left leading-snug">
                  DIGITAL STUDENT ID<br />CARD
                </span>
              </button>

              <button className="w-full bg-[#F2FBF6] rounded-2xl p-4 flex items-center justify-center sm:justify-start gap-4 hover:bg-[#e6f7ec] transition-colors group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#2A9D79]">
                  <FaFileLines size={18} />
                </div>
                <span className="text-[#2A9D79] text-[13px] font-bold tracking-widest text-left leading-snug">
                  OFFICIAL ACADEMIC<br />TRANSCRIPT
                </span>
              </button>
            </div>

          </div>

          {/* Right Column */}
          <div className="order-1 xl:order-2 xl:col-span-8 space-y-6 lg:space-y-8">

            {/* Personal Information */}
            <div className="bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 lg:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
                <div className="min-w-0">
                  <h2 className="text-[21px] sm:text-[24px] font-bold text-[#1D214E]">Personal Information</h2>
                  <p className="text-[#7F8A9E] text-[14px] sm:text-[15px] font-medium mt-1">Update your university profile and contact details</p>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 whitespace-nowrap rounded-xl font-bold text-[15px] shadow-[0_8px_20px_rgba(78,88,202,0.3)] transition-colors leading-snug disabled:opacity-60 ${
                    isEditing
                      ? "bg-[#4E58CA] text-white hover:bg-[#3c4dba]"
                      : "bg-white text-[#4E58CA] border border-[#DDE1FF] hover:bg-[#F3F6FF]"
                  }`}
                >
                  {isSaving ? (
                    "Saving..."
                  ) : isEditing ? (
                    <>Save Profile Changes</>
                  ) : (
                    "Edit Data"
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 sm:gap-y-8">
                {/* Full Name */}
                <div>
                  <label className="block text-[#A09DB0] text-[11px] font-bold tracking-widest mb-2 uppercase">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A09DB0]" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={profileData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold transition-all ${
                        isEditing
                          ? "bg-[#EBE8F4] text-[#1D214E] focus:ring-2 focus:ring-[#4E58CA]"
                          : "bg-[#F2F1F7] text-[#7F8A9E] cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {/* University ID */}
                <div>
                  <label className="block text-[#A09DB0] text-[11px] font-bold tracking-widest mb-2 uppercase">University ID (Read Only)</label>
                  <div className="relative">
                    <IoIdCardOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A09DB0] text-xl" />
                    <input
                      type="text"
                      readOnly
                      value={userData?.id || ""}
                      className="w-full pl-12 pr-4 py-4 bg-[#F2F1F7] rounded-2xl outline-none text-[#A09DB0] font-bold italic opacity-80"
                    />
                  </div>
                </div>

                {/* Academic Email */}
                <div className="md:col-span-2">
                  <label className="block text-[#A09DB0] text-[11px] font-bold tracking-widest mb-2 uppercase">Academic Email Address</label>
                  <div className="relative">
                    <MdEmail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A09DB0] text-lg" />
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={profileData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none font-bold transition-all ${
                        isEditing
                          ? "bg-[#EBE8F4] text-[#1D214E] focus:ring-2 focus:ring-[#4E58CA]"
                          : "bg-[#F2F1F7] text-[#7F8A9E] cursor-not-allowed"
                      }`}
                    />
                  </div>
                </div>

                {/* Primary Department */}
                <div className="relative">
                  <label className="block text-[#A09DB0] text-[11px] font-bold tracking-widest mb-2 uppercase">Primary Department</label>
                  <div className="relative cursor-pointer">
                    <FaBuilding className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A09DB0]" />
                    <input
                      type="text"
                      list="DepartmentOptions"
                      disabled={!isEditing}
                      value={profileData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      className={`w-full pl-12 pr-10 py-4 rounded-2xl outline-none font-bold transition-all ${
                        isEditing
                          ? "bg-[#EBE8F4] text-[#1D214E] cursor-pointer focus:ring-2 focus:ring-[#4E58CA]"
                          : "bg-[#F2F1F7] text-[#7F8A9E] cursor-not-allowed"
                      }`}
                    />
                    <datalist id="DepartmentOptions">
                      {departments.map((department) => (
                        <option
                          key={department.department_id || department.name}
                          value={department.name}
                        />
                      ))}
                    </datalist>
                    <IoChevronDownOutline className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A09DB0] text-lg pointer-events-none" />
                  </div>
                </div>

                {/* Current Academic Year */}
                <div className="relative">
                  <label className="block text-[#A09DB0] text-[11px] font-bold tracking-widest mb-2 uppercase">Current Academic Year</label>
                  <div className="relative cursor-pointer">
                    <IoCalendarOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A09DB0] text-lg" />
                    <input
                      type="text"
                      list="YearOptions"
                      disabled={!isEditing}
                      value={profileData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                      className={`w-full pl-12 pr-10 py-4 rounded-2xl outline-none font-bold transition-all ${
                        isEditing
                          ? "bg-[#EBE8F4] text-[#1D214E] cursor-pointer focus:ring-2 focus:ring-[#4E58CA]"
                          : "bg-[#F2F1F7] text-[#7F8A9E] cursor-not-allowed"
                      }`}
                    />
                    <datalist id="YearOptions">
                      <option value="First Year" />
                      <option value="Second Year" />
                      <option value="Third Year" />
                      <option value="Fourth Year" />
                      <option value="Graduated" />
                    </datalist>
                    <IoChevronDownOutline className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A09DB0] text-lg pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
