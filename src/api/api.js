const BASE_URL = process.env.REACT_APP_API_URL;

export async function apiFetch(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      window.dispatchEvent(new Event("unauthorized"));
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API Error");
  }
  
  return response;
}

export async function get(url, params) {
    let query = "";
    if (params) {
      query = "?" + new URLSearchParams(params).toString();
    }
    const res = await apiFetch(url + query, {
      method: "GET",
    });
    return res.json();
  }
  
export async function post(url, data) {
    const res = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return res.json();
}