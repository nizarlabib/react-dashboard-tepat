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

    throw new Error(
      "GET /products is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  getProduct: async (id: string): Promise<Product> => {
    if (USE_MOCK) {
      return productsMock.getProduct(id);
    }

    throw new Error(
      "GET /products/:id is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  createProduct: async (): Promise<Product> => {
    if (USE_MOCK) {
      throw new Error("Create not implemented in mock");
    }

    throw new Error(
      "POST /products is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  updateProduct: async (): Promise<Product> => {
    if (USE_MOCK) {
      throw new Error("Update not implemented in mock");
    }

    throw new Error(
      "PUT /products/:id is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },

  deleteProduct: async (): Promise<null> => {
    if (USE_MOCK) {
      throw new Error("Delete not implemented in mock");
    }

    throw new Error(
      "DELETE /products/:id is not implemented in go-starter-service. This is a frontend integration placeholder.",
    );
  },
};
