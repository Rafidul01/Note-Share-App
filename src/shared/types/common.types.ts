export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
