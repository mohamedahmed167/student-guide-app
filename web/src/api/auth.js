import { env } from "../environment/environment";
import { apiRequest, clearTokens, persistTokensFromData } from "./client";
import { mapStudentToUser } from "./mappers";

export async function register({
  username,
  email,
  password,
  full_name,
  department,
  current_level,
  invite_code,
}) {
  const data = await apiRequest(env.endpoints.register, {
    method: "POST",
    auth: false,
    body: {
      username,
      email,
      password,
      full_name,
      department,
      current_level,
      ...(invite_code ? { invite_code } : {}),
    },
  });
  persistTokensFromData(data);

  const student = data?.student || data;
  const user = mapStudentToUser(student, { email, username });
  saveSession(user);
  return {
    message: data?.message,
    user,
    raw: data,
  };
}

export async function login({ username, password }) {
  const data = await apiRequest(env.endpoints.login, {
    method: "POST",
    auth: false,
    body: { username, password },
  });
  persistTokensFromData(data);
  return data;
}

export async function logout() {
  try {
    await apiRequest(env.endpoints.logout, { method: "POST" });
  } finally {
    clearTokens();
  }
}

export async function getMe() {
  const data = await apiRequest(env.endpoints.me);
  return mapStudentToUser(data?.student || data);
}

export async function verifyOtp({ email, otp_code }) {
  return apiRequest(env.endpoints.verifyOtp, {
    method: "POST",
    auth: false,
    body: { email, otp_code },
  });
}

export function saveSession(user) {
  if (user) {
    localStorage.setItem("token", "authenticated");
    localStorage.setItem("studentGuideUserData", JSON.stringify(user));
  }
}

export function clearSession() {
  clearTokens();
  localStorage.removeItem("token");
  localStorage.removeItem("studentGuideUserData");
}
