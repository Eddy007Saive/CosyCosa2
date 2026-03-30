import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

export const getProperties = (params?: Record<string, unknown>) =>
  api.get("/properties", { params }).then((r) => r.data);

export const getProperty = (id: string) =>
  api.get(`/properties/${id}`).then((r) => r.data);

export const getCategories = () =>
  api.get("/categories").then((r) => r.data);

export const getSiteImages = () =>
  api.get("/settings/images").then((r) => r.data);

export const getBlogPosts = () =>
  api.get("/blog").then((r) => r.data);

export const getBlogPost = (slug: string) =>
  api.get(`/blog/${slug}`).then((r) => r.data);

export const getSectors = () =>
  api.get("/sectors").then((r) => r.data);

export const getSector = (slug: string) =>
  api.get(`/sectors/${slug}`).then((r) => r.data);

export const getPropertyAvailability = (
  id: string,
  fromDate: string,
  toDate: string
) =>
  api
    .get(`/properties/${id}/availability`, {
      params: { from_date: fromDate, to_date: toDate },
    })
    .then((r) => r.data);

export const getPriceQuote = (
  id: string,
  data: { property_id: string; check_in: string; check_out: string; guests: number }
) => api.post(`/properties/${id}/price-quote`, data).then((r) => r.data);

export const createBooking = (data: Record<string, unknown>) =>
  api.post("/bookings", data).then((r) => r.data);

export const submitContact = (data: Record<string, unknown>) =>
  api.post("/contact", data).then((r) => r.data);

export const adminLogin = (password: string) =>
  api.post("/admin/login", { password }).then((r) => r.data);

export default api;
