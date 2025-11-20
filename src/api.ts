import { getToken } from "./services/authService";

export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : ""
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) throw new Error("Error en API");

  return res.json() as Promise<T>;
}
