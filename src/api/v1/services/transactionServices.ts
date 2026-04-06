import * as transactionRepository from "../repositories/transactionRepository";
import * as productRepository from "../repositories/productRepository";
import {
  InventoryTransaction,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../models/transactionModel";
import { Product } from "../models/productModel";

export const getAllTransactions = async (): Promise<InventoryTransaction[]> => {
  return transactionRepository.getAllTransactionsFromDB();
};

export const getTransactionById = async (
  id: string
): Promise<InventoryTransaction | null> => {
  return transactionRepository.getTransactionByIdFromDB(id);
};

export const createTransaction = async (
  data: CreateTransactionInput
): Promise<InventoryTransaction> => {
  const product = await productRepository.getProductById(data.productId);

  if (!product) {
    throw new Error("Product not found");
  }

  let newQuantity = product.quantity;

  if (data.type === "add") {
    newQuantity += data.quantityChanged;
  } else if (data.type === "remove") {
    if (product.quantity < data.quantityChanged) {
      throw new Error("Insufficient stock");
    }
    newQuantity -= data.quantityChanged;
  } else if (data.type === "adjust") {
    newQuantity = data.quantityChanged;
  }

  await productRepository.updateProductFromDB(product.id, {
    quantity: newQuantity,
  });

  const nextId = await transactionRepository.getNextTransactionIdFromDB();

  const newTransaction: InventoryTransaction = {
    id: nextId,
    ...data,
  };

  return transactionRepository.createTransactionInDB(newTransaction);
};

export const updateTransaction = async (
  id: string,
  data: UpdateTransactionInput
): Promise<InventoryTransaction | null> => {
  return transactionRepository.updateTransactionInDB(id, data);
};

export const deleteTransaction = async (
  id: string
): Promise<InventoryTransaction | null> => {
  return transactionRepository.deleteTransactionFromDB(id);
};