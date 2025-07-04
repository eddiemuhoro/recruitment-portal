export const API_CONFIG = {
  BASE_URL: "https://skyways-five.vercel.app/api",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/token",
    },
    APPLICATIONS: {
      BASE: "/applications",
      STATUS: (id: string) => `/applications/${id}/status`,
    },
    JOBS: {
      BASE: "/jobs",
    },
    EMPLOYER_INQUIRIES: {
      BASE: "/employer-inquiries",
    },
    CONTACT_INQUIRIES: {
      BASE: "/contact-inquiries",
    },
    ANALYTICS: {
      BASE: "/agency-analytics",
      DASHBOARD: (id: number) => `/agency-analytics/${id}/dashboard`,
      REVENUE: (id: number) => `/agency-analytics/${id}/revenue`,
    },
  },
} as const;
