export const API_BASE_URL = "http://localhost:8080";

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
  },
  STUDENTS: {
    ALL: `${API_BASE_URL}/students`,
    BY_ID: (id) => `${API_BASE_URL}/students/${id}`,
  },
  COURSES: {
    ALL: `${API_BASE_URL}/courses`,
    BY_ID: (id) => `${API_BASE_URL}/courses/${id}`,
  },
  ENROLLMENTS: {
    ALL: `${API_BASE_URL}/enrollments`,
    BY_ID: (id) => `${API_BASE_URL}/enrollments/${id}`,
  },
  MARKS: {
    ALL: `${API_BASE_URL}/marks`,
    BY_ID: (id) => `${API_BASE_URL}/marks/${id}`,
  },
};

async function parseError(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await response.json();
    return data.message || data.error || "An error occurred";
  }
  const text = await response.text();
  return text || `Request failed (HTTP ${response.status})`;
}

export async function apiRequest(url, options = {}) {
  const opts = { ...options };
  if (opts.body && !opts.headers) {
    opts.headers = { "Content-Type": "application/json" };
  }
  if (opts.body && opts.headers && !opts.headers["Content-Type"]) {
    opts.headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, opts);
    if (response.status === 204) return { ok: true, data: null, status: 204 };
    const ok = response.ok;
    let data;
    if (ok) {
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } else {
      const errorMessage = await parseError(response);
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }
    return { ok: true, data, status: response.status };
  } catch (error) {
    if (error.message === "Failed to fetch") {
      throw new Error("Cannot connect to the server. Make sure the backend is running at " + API_BASE_URL);
    }
    throw error;
  }
}
