import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminAccessToken");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthRoute = originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh");
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("adminRefreshToken");
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const { data } = await api.post("/auth/refresh", { refreshToken });
        localStorage.setItem("adminAccessToken", data.accessToken);
        localStorage.setItem("adminRefreshToken", data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export async function fetchContent(type, params = {}) {
  const { data } = await api.get(`/content/${type}`, { params: { ...params, published: true } });
  return data;
}

export async function submitContact(payload) {
  const { data } = await api.post("/contact/submit", payload);
  return data;
}

export async function adminList(type, params = {}) {
  const { data } = await api.get(`/content/${type}`, { params });
  return data;
}

export async function adminCreate(type, payload) {
  const { data } = await api.post(`/content/${type}`, payload);
  return data;
}

export async function adminUpdate(type, id, payload) {
  const { data } = await api.put(`/content/${type}/${id}`, payload);
  return data;
}

export async function adminDelete(type, id) {
  const { data } = await api.delete(`/content/${type}/${id}`);
  return data;
}

export async function updateAdminProfile(payload) {
  const { data } = await api.patch("/auth/me", payload);
  return data;
}

export async function getPrimaryContactDetails() {
  const { data } = await api.get("/content/contactDetails", { params: { published: true, limit: 1 } });
  if (data?.items?.[0]) {
    return data.items[0];
  }

  const fallback = await api.get("/content/contactDetails", { params: { limit: 1 } });
  return fallback.data?.items?.[0] || null;
}

export async function adminTranslate(text, targetLang = "bn") {
  const { data } = await api.post("/admin/translate", { text, targetLang });
  return data.translatedText;
}
