import { ApiError } from "../lib/api/errors";
import { mockResponse } from "../lib/api/mock";
import type { ErrorResponse } from "../types/api";
import type { GetProductsParams } from "../types/product";
import type { Product } from "../types";
import { products } from "../mock/data";

const statuses: Product["status"][] = ["in_stock", "low_stock", "out_of_stock"];
const categories = [...new Set(products.map((product) => product.category))];

function notFound(message: string): never {
  const error: ErrorResponse = {
    success: false,
    message,
    meta: { timestamp: new Date().toISOString(), code: "NOT_FOUND" },
  };
  throw new ApiError(error, 404);
}

export const productsMock = {
  getProducts: async (
    params?: GetProductsParams,
  ): Promise<Product[]> => {
    let filtered = products;

    if (params?.search) {
      const query = params.search.trim().toLowerCase();
      if (query) {
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query),
        );
      }
    }

    if (params?.category && categories.includes(params.category)) {
      filtered = filtered.filter((product) => product.category === params.category);
    }

    if (
      params?.status &&
      statuses.includes(params.status as Product["status"])
    ) {
      filtered = filtered.filter((product) => product.status === params.status);
    }

    return mockResponse(filtered, 400);
  },

  getProduct: async (id: string): Promise<Product> => {
    const product = products.find((item) => item.id === id);

    if (!product) {
      notFound("Product not found");
    }

    return mockResponse(product, 300);
  },
};
