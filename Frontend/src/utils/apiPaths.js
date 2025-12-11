

// ✅ CORRECT - Include /api in BASE_URL
export const BASE_URL = 'http://localhost:4000/api';

// Then update API_PATHS to remove /api prefix
export const API_PATHS = {
  AUTH: {
    REGISTER: '/auth/register',      // Remove /api
    LOGIN: '/auth/login',            // Remove /api
    GET_PROFILE: '/auth/profile',    // Remove /api
  },
  RESUME: {
    CREATE: '/resume',               // Remove /api
    GET_ALL: '/resume',              // Remove /api
    GET_BY_ID: (id) => `/resume/${id}`,
    UPDATE: (id) => `/resume/${id}`,
    DELETE: (id) => `/resume/${id}`,
    UPLOAD_IMAGES: (id) => `/resume/${id}/upload-images`,
  },
  IMAGE: {
    UPLOAD_IMAGE: '/auth/upload-image'  // Add leading slash
  }
};