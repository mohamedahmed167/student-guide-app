import { create } from "zustand";

function applyDarkMode(enabled) {
  if (enabled) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

const savedDark = localStorage.getItem("darkMode") === "true";
applyDarkMode(savedDark);

const useStudentStore = create((set) => ({
  student: null,
  isLoading: false,
  error: null,
  displayName: localStorage.getItem("studentName") || "",
  coverImage: localStorage.getItem("coverImage") || null,
  profileImage: localStorage.getItem("profileImage") || null,
  darkMode: savedDark,

  setStudent: (student) => set({ student }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearStudent: () => set({ student: null, error: null }),

  setDisplayName: (name) => {
    localStorage.setItem("studentName", name);
    set({ displayName: name });
  },

  setCoverImage: (dataUrl) => {
    if (dataUrl === null) localStorage.removeItem("coverImage");
    else localStorage.setItem("coverImage", dataUrl);
    set({ coverImage: dataUrl });
  },

  setProfileImage: (dataUrl) => {
    if (dataUrl === null) localStorage.removeItem("profileImage");
    else localStorage.setItem("profileImage", dataUrl);
    set({ profileImage: dataUrl });
  },

  // Resets BOTH cover and profile images at once
  resetAllImages: () => {
    localStorage.removeItem("coverImage");
    localStorage.removeItem("profileImage");
    set({ coverImage: null, profileImage: null });
  },

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode;
      localStorage.setItem("darkMode", String(next));
      applyDarkMode(next);
      return { darkMode: next };
    }),
}));

export default useStudentStore;
