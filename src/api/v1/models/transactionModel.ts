export interface InventoryTransaction {
  id: string;
  productId: string;
  quantityChanged: number;
  type: "add" | "remove" | "adjust";
  date: string;
  notes?: string;
}

export interface CreateTransactionInput {
  productId: string;
  quantityChanged: number;
  type: "add" | "remove" | "adjust";
  date: string;
  notes?: string;
}

export interface UpdateTransactionInput {
  quantityChanged?: number;
  type?: "add" | "remove" | "adjust";
  date?: string;
  notes?: string;
}