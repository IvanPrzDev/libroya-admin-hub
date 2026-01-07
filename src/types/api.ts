export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export type UserRole = "admin" | "user";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export type BookGenre =
  | "fiction"
  | "non_fiction"
  | "mystery"
  | "romance"
  | "drama"
  | "thriller"
  | "science_fiction"
  | "fantasy"
  | "horror"
  | "biography"
  | "autobiography"
  | "history"
  | "children"
  | "young_adult"
  | "self_help"
  | "classics"
  | "comedy"
  | "western"
  | "literature";

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
  genre?: BookGenre;
  description?: string;
  available: boolean;
  availabilityReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn?: string;
  publishedYear?: number;
  genre?: BookGenre;
  description?: string;
  available?: boolean;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  isbn?: string;
  publishedYear?: number;
  genre?: BookGenre;
  description?: string;
  available?: boolean;
  availabilityReason?: string;
}

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "CORRUPTED";

export interface Reservation {
  _id: string;
  userId: string;
  bookId: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  locator?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest {
  userId: string;
  bookId: string;
  startDate: string;
  endDate: string;
}

export interface UpdateReservationRequest {
  userId?: string;
  bookId?: string;
  startDate?: string;
  endDate?: string;
  status?: ReservationStatus;
}

export interface ConfirmQrRequest {
  qrData: string;
}

export interface CancelReservationRequest {
  reason: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
