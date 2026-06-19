import { env } from "../environment/environment";

const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function getToken() {
  const token =
    localStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem("access") ||
    localStorage.getItem("jwt");

  return token && token !== "authenticated" ? token : null;
}

export function setTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

function extractTokensFromSetCookie(setCookieHeader) {
  if (!setCookieHeader) return {};

  const accessMatch = setCookieHeader.match(/access_token=([^;,\s]+)/);
  const refreshMatch = setCookieHeader.match(/refresh_token=([^;,\s]+)/);

  return {
    accessToken: accessMatch?.[1] || null,
    refreshToken: refreshMatch?.[1] || null,
  };
}

function extractTokensFromData(data) {
  if (!data || typeof data !== "object") return {};

  const source = data.tokens || data.token || data.auth || data;
  const accessToken =
    source.access_token ||
    source.access ||
    source.accessToken ||
    source.jwt ||
    (typeof source.token === "string" ? source.token : null);
  const refreshToken =
    source.refresh_token ||
    source.refresh ||
    source.refreshToken ||
    null;

  return { accessToken, refreshToken };
}

export function persistTokensFromData(data) {
  const { accessToken, refreshToken } = extractTokensFromData(data);
  setTokens(accessToken, refreshToken);
  return { accessToken, refreshToken };
}

function buildAuthHeaders() {
  const token = getToken();
  if (!token) return {};

  return {
    Authorization: `JWT ${token}`,
  };
}

function buildApiUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;

  const baseUrl = env.baseUrl.replace(/\/+$/, "");
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${endpoint}`;
}

export async function apiRequest(path, options = {}) {
  const { body, headers = {}, auth = true, ...rest } = options;

  const isFormData = body instanceof FormData;

  const requestHeaders = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...headers,
    ...(auth ? buildAuthHeaders() : {}),
  };

  const response = await fetch(buildApiUrl(path), {
    credentials: "include",
    ...rest,
    headers: requestHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    const { accessToken, refreshToken } = extractTokensFromSetCookie(setCookie);
    setTokens(accessToken, refreshToken);
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => null);

  persistTokensFromData(data);

  if (!response.ok) {
    const message =
      data?.error ||
      data?.detail ||
      data?.message ||
      (typeof data === "string" ? data : null) ||
      `Request failed (${response.status})`;

    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
