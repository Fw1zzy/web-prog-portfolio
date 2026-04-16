const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export const getAuthToken = () => localStorage.getItem("authToken");

export const fetchJson = async (path, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const bodyText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(bodyText);
    } catch {
      errorData = bodyText;
    }
    const error = new Error(
      errorData?.message || errorData || `HTTP ${response.status}`,
    );
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return data;
};

export default API_BASE;
