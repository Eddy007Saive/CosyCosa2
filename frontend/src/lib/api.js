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

export default apiClient;
