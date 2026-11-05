export interface GetProductsParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  status?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
