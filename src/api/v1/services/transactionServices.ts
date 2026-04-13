import * as transactionRepository from "../repositories/transactionRepository";
import * as productRepository from "../repositories/productRepository";
import {
  InventoryTransaction,
  CreateTransactionInput,
  UpdateTransactionInput,
} from "../models/transactionModel";
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from "../../../constants/httpsConstants";

export const getAllTransactions = async (): Promise<InventoryTransaction[]> => {
  return transactionRepository.getAllTransactionsFromDB();
};

export const getTransactionById = async (
  id: string
): Promise<InventoryTransaction> => {
  const transaction = await transactionRepository.getTransactionByIdFromDB(id);

  if (!transaction) {
    throw new AppError("Transaction not found", HTTP_STATUS.NOT_FOUND);
  }

  return transaction;
};

export const createTransaction = async (
  data: CreateTransactionInput
): Promise<InventoryTransaction> => {
  const product = await productRepository.getProductById(data.productId);

  if (!product) {
    throw new AppError("Product not found", HTTP_STATUS.NOT_FOUND);
  }

  let newQuantity = product.quantity;

  if (data.type === "add") {
    newQuantity += data.quantityChanged;
  } else if (data.type === "remove") {
    if (product.quantity < data.quantityChanged) {
      throw new AppError("Insufficient stock", HTTP_STATUS.BAD_REQUEST);
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
    createdAt: new Date().toISOString(),
  };

  return transactionRepository.createTransactionInDB(newTransaction);
};

export const updateTransaction = async (
  id: string,
  data: UpdateTransactionInput
): Promise<InventoryTransaction> => {
  const updatedTransaction = await transactionRepository.updateTransactionInDB(id, data);

  if (!updatedTransaction) {
    throw new AppError("Transaction not found", HTTP_STATUS.NOT_FOUND);
  }

  return updatedTransaction;
};

export const deleteTransaction = async (
  id: string
): Promise<InventoryTransaction> => {
  const deletedTransaction = await transactionRepository.deleteTransactionFromDB(id);

  if (!deletedTransaction) {
    throw new AppError("Transaction not found", HTTP_STATUS.NOT_FOUND);
  }

  return deletedTransaction;
};