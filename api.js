import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error messages so components can just read err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ---- Auth ----
export const authApi = {
  signup: (data) => api.post("/auth/signup", data).then((r) => r.data),
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
  updateMe: (data) => api.put("/auth/me", data).then((r) => r.data),
};

// ---- Properties ----
export const propertyApi = {
  list: (params) => api.get("/properties", { params }).then((r) => r.data),
  getById: (id) => api.get(`/properties/${id}`).then((r) => r.data),
  mine: () => api.get("/properties/host/mine").then((r) => r.data),
  create: (formData) =>
    api
      .post("/properties", formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
  update: (id, formData) =>
    api
      .put(`/properties/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => r.data),
  remove: (id) => api.delete(`/properties/${id}`).then((r) => r.data),
  removeImage: (id, publicId) => api.delete(`/properties/${id}/images/${publicId}`).then((r) => r.data),
};

// ---- Bookings ----
export const bookingApi = {
  create: (data) => api.post("/bookings", data).then((r) => r.data),
  mine: () => api.get("/bookings/mine").then((r) => r.data),
  host: () => api.get("/bookings/host").then((r) => r.data),
  getById: (id) => api.get(`/bookings/${id}`).then((r) => r.data),
  cancel: (id) => api.put(`/bookings/${id}/cancel`).then((r) => r.data),
};

export default api;
