import api from "@/lib/axios";

export async function login(username, password) {
  const { data } = await api.post("/auth/login", { username, password, expiresInMins: 60 });
  return data; // { accessToken, refreshToken, id, username, firstName, ... }
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data;
}
