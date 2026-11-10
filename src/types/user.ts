export interface GetUsersParams {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  role_id?: string;
  order_by?: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
