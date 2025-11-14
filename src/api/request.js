const API_URL = "http://localhost:5000";

export async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  if (response.status === 401) {
    console.error("Token inválido o no proporcionado");
    throw new Error("No autorizado");
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error en la petición");
  }

  // 👉 Normalizamos siempre la salida
  const json = await response.json();

  // Si viene como { data: [...] }
  if (json && typeof json === "object" && "data" in json) {
    return json.data;
  }

  // Si ya viene como array
  return json;
}