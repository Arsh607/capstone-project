import api from "./axios";

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  supplierId: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: string;
  quantity: string;
  category: string;
  supplierId: string;
}
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData: ProductInput) => {
  const response = await api.post("/products", productData);
  return response.data;
};

export const updateProduct = async (
  id: string,
  productData: Partial<ProductInput>
) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};