import { api } from "../lib/api/client";
import { endpoints } from "../lib/api/endpoints";
import type { GetProductsParams } from "../types/product";
import type { Product } from "../types";
import { productsMock } from "../mocks/products.mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

export const productService = {
  getProducts: async (
    params?: GetProductsParams,
  ): Promise<Product[]> => {
    if (USE_MOCK) {
      return productsMock.getProducts(params);
    }
    return api.get<Product[]>(endpoints.products.list(), {
      query: params as Record<string, unknown>,
    });
  },

  getProduct: async (id: string): Promise<Product> => {
    if (USE_MOCK) {
      return productsMock.getProduct(id);
    }
    return api.get<Product>(endpoints.products.detail(id));
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    if (USE_MOCK) {
      throw new Error("Create not implemented in mock");
    }
    return api.post<Product>(endpoints.products.create(), {
      body: data,
    });
  },

  updateProduct: async (
    id: string,
    data: Partial<Product>,
  ): Promise<Product> => {
    if (USE_MOCK) {
      throw new Error("Update not implemented in mock");
    }
    return api.put<Product>(endpoints.products.update(id), {
      body: data,
    });
  },

  deleteProduct: async (id: string): Promise<null> => {
    if (USE_MOCK) {
      throw new Error("Delete not implemented in mock");
    }
    return api.delete<null>(endpoints.products.remove(id));
  },
};
