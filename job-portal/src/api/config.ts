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
      DOCUMENT_REQUIREMENTS: (id: string) =>
        `/jobs/${id}/document-requirements`,
    },
    DOCUMENTS: {
      TYPES: "/document-types",
    },
    EMPLOYER_INQUIRIES: {
      BASE: "/employer-inquiries",
    },
  },
} as const;
