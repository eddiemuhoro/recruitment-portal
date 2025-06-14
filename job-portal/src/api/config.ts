export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/token',
    },
    APPLICATIONS: {
      BASE: '/applications',
      STATUS: (id: string) => `/applications/${id}/status`,
    },
    JOBS: {
      BASE: '/jobs',
    },
  },
} as const; 