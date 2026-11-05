export interface GetUsersParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  role?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
