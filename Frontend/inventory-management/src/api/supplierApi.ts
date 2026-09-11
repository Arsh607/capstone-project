import api from "./axios";

export interface SupplierInput {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export const getSuppliers = async () => {
  const response = await api.get("/suppliers");
  return response.data;
};

export const getSupplierById = async (id: string) => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

export const createSupplier = async (supplierData: SupplierInput) => {
  const response = await api.post("/suppliers", supplierData);
  return response.data;
};

export const updateSupplier = async (
  id: string,
  supplierData: Partial<SupplierInput>
) => {
  const response = await api.put(`/suppliers/${id}`, supplierData);
  return response.data;
};

export const deleteSupplier = async (id: string) => {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
};