const BASE_URL = process.env.REACT_APP_API_URL || "";

export async function apiFetch(url, options = {}) {
  const fullUrl = url.startsWith("/")
    ? `${BASE_URL}${url}`
    : `${BASE_URL}/${url}`;

  const {
    skipUnauthorizedEvent = false,
    ...fetchOptions
  } = options;

  const response = await fetch(fullUrl, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  if (!response.ok) {
    if (
      !skipUnauthorizedEvent &&
      (response.status === 401 || response.status === 403)
    ) {
      window.dispatchEvent(new Event("unauthorized"));
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error (${response.status})`);
  }

  return response;
}

export async function get(url, params, options = {}) {
  let query = "";
  if (params) {
    query = "?" + new URLSearchParams(params).toString();
  }

  const res = await apiFetch(url + query, {
    method: "GET",
    ...options,
  });

  return res.json();
}

export async function post(url, data, options = {}) {
  const res = await apiFetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...options,
  });

  return res.json();
}