// AUTH ENDPOINTS
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
} as const;

// BOOKS ENDPOINTS
const BOOKS_BASE = "/admin/books";

export const BOOKS_ENDPOINTS = {
  BASE: BOOKS_BASE,
  BY_ID: (id: string) => `${BOOKS_BASE}/${id}`,
} as const;

// USERS ENDPOINTS
const USERS_BASE = "/admin/users";

export const USERS_ENDPOINTS = {
  BASE: USERS_BASE,
  BY_ID: (id: string) => `${USERS_BASE}/${id}`,
} as const;

// RESERVATIONS ENDPOINTS
const RESERVATIONS_BASE = "/admin/reservations";

export const RESERVATIONS_ENDPOINTS = {
  BASE: RESERVATIONS_BASE,
  BY_ID: (id: string) => `${RESERVATIONS_BASE}/${id}`,
  BY_USER: (userId: string) => `${RESERVATIONS_BASE}/user/${userId}`,
  BY_BOOK: (bookId: string) => `${RESERVATIONS_BASE}/book/${bookId}`,
  CONFIRM_QR: `${RESERVATIONS_BASE}/confirm-qr`,
  CANCEL: (id: string) => `${RESERVATIONS_BASE}/${id}/cancel`,
  COMPLETE: (id: string) => `${RESERVATIONS_BASE}/${id}/complete`,
  TEST_SCHEDULER: `${RESERVATIONS_BASE}/test-scheduler`,
} as const;
