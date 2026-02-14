import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Categories
export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

// Properties
export const getProperties = async (params = {}) => {
  const response = await apiClient.get('/properties', { params });
  return response.data;
};

// Admin: Get all properties including hidden ones
export const getAdminProperties = async () => {
  const response = await apiClient.get('/properties', { params: { include_hidden: true } });
  return response.data;
};

export const getProperty = async (propertyId) => {
  const response = await apiClient.get(`/properties/${propertyId}`);
  return response.data;
};

export const getPropertyAvailability = async (propertyId, fromDate, toDate) => {
  const response = await apiClient.get(`/properties/${propertyId}/availability`, {
    params: { from_date: fromDate, to_date: toDate }
  });
  return response.data;
};

export const getPriceQuote = async (propertyId, checkIn, checkOut, guests) => {
  const response = await apiClient.post(`/properties/${propertyId}/price-quote`, {
    property_id: propertyId,
    check_in: checkIn,
    check_out: checkOut,
    guests
  });
  return response.data;
};

// Bookings
export const createBooking = async (bookingData) => {
  const response = await apiClient.post('/bookings', bookingData);
  return response.data;
};

export const getBooking = async (bookingId) => {
  const response = await apiClient.get(`/bookings/${bookingId}`);
  return response.data;
};

// Contact
export const submitContact = async (contactData) => {
  const response = await apiClient.post('/contact', contactData);
  return response.data;
};

// Sync
export const syncBeds24 = async () => {
  const response = await apiClient.post('/sync/beds24');
  return response.data;
};

export const getSyncStatus = async () => {
  const response = await apiClient.get('/sync/status');
  return response.data;
};

export const triggerSync = async () => {
  const response = await apiClient.post('/sync/trigger');
  return response.data;
};

// Site Images
export const getSiteImages = async () => {
  const response = await apiClient.get('/settings/images');
  return response.data;
};

export const updateSiteImages = async (images) => {
  const response = await apiClient.put('/settings/images', images);
  return response.data;
};

export const updateSingleSiteImage = async (imageKey, url) => {
  const response = await apiClient.put(`/settings/images/${imageKey}`, null, {
    params: { url }
  });
  return response.data;
};

// Image Upload
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API}/upload/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  // Convert relative URL to absolute URL
  const data = response.data;
  if (data.url && data.url.startsWith('/api/')) {
    data.url = `${BACKEND_URL}${data.url}`;
  }
  
  return data;
};

export default apiClient;
