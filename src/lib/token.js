// The login token is kept in a cookie (not only localStorage) so that
// src/proxy.js can read it on the server and block logged-out users
// before any protected page is rendered.
export const TOKEN_COOKIE = "token";
const USER_KEY = "user";
const ONE_HOUR = 60 * 60;

export function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setSession(token, user) {
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${ONE_HOUR}; samesite=lax`;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}
