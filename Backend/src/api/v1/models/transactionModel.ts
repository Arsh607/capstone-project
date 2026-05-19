export interface InventoryTransaction {
  id: string;
  productId: string;
  quantityChanged: number;
  type: "add" | "remove" | "adjust";
  createdAt: string;
  updatedAt?: string;
  notes?: string;
};

export interface CreateTransactionInput {
  productId: string;
  quantityChanged: number;
  type: "add" | "remove" | "adjust";
  notes?: string;
};

export interface UpdateTransactionInput {
  quantityChanged?: number;
  type?: "add" | "remove" | "adjust";
  notes?: string;
};

export interface TransactionFilter {
  productId?: string;
  type?: "add" | "remove" | "adjust";
  startDate?: string;
  endDate?: string;
}