import * as transactionServices from '../services/transactionServices';
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpsConstants";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const transactions = await transactionServices.getAllTransactions();

    res.status(HTTP_STATUS.OK).json({
      message: "Transactions retrieved successfully",
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const transaction = await transactionServices.getTransactionById(id);

    if (!transaction) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Transaction not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, quantityChanged, type, notes } = req.body;

    const newTransaction = await transactionServices.createTransaction({
      productId,
      quantityChanged,
      type,
      notes,
    });

    res.status(HTTP_STATUS.CREATED).json({
      message: "Transaction created successfully",
      data: newTransaction,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updatedTransaction = await transactionServices.updateTransaction(id, req.body);

    if (!updatedTransaction) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Transaction not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deletedTransaction = await transactionServices.deleteTransaction(id);

    if (!deletedTransaction) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Transaction not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Transaction deleted successfully",
      data: deletedTransaction,
    });
  } catch (error) {
    next(error);
  }
};