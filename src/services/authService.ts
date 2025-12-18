export async function login(email: string, password: string): Promise<void> {
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        "accept": "*/*"
      },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error("Credenciales inválidas");

    const data = await res.json();
    localStorage.setItem("token", data.token);
  }

export const register = async (email: string, password: string, firstName: string, lastName: string, padron: number) => {
  try {
    const response = await fetch(`http://localhost:8080/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password, 
        firstName, 
        lastName,
        padron
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el registro');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};
  
  export function logout() {
    localStorage.removeItem("token");
  }
  
  export function getToken(): string | null {
    return localStorage.getItem("token");
  }
  
  export function isAuthenticated(): boolean {
    return !!getToken();
  }

  /*
   * Funcion para hacer fetch a la API con el token de autenticacion
   * @param url - URL de la API
   * @param options - Opciones de la peticion
   * @returns Promise con el resultado de la peticion
   */
  export async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    
    if (!token) {
      throw new Error("No hay token de autenticación. Por favor, iniciá sesión.");
    }
  
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "accept": "*/*"
    };
  
    const res = await fetch(url, { ...options, headers });
  
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Error ${res.status}: ${errorText}`);
      throw new Error(`Error ${res.status}: ${errorText || res.statusText}`);
    }

    return res.json() as Promise<T>;
  }