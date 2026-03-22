const BASE_URL = "http://localhost:8080";

export async function apiFetch(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("API Error");
  }

  return response;
}