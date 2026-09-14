import api from "./axios";

export interface TransactionInput {
  productId: string;
  quantityChanged: number;
  type: "add" | "remove" | "adjust";
  notes?: string;
}

export const getTransactions = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

export const getTransactionById = async (id: string) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (
  transactionData: TransactionInput
) => {
  const response = await api.post("/transactions", transactionData);
  return response.data;
};

export const updateTransaction = async (
  id: string,
  transactionData: Partial<TransactionInput>
) => {
  const response = await api.put(`/transactions/${id}`, transactionData);
  return response.data;
};

