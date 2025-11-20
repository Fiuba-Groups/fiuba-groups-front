export async function login(email: string, password: string): Promise<void> {
  const res = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new Error("Credenciales inválidas");

  const data = await res.json();
  localStorage.setItem("token", data.token);
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
