import { db } from "../../../config/firebaseConfig";
import { InventoryTransaction, UpdateTransactionInput, TransactionFilter } from "../models/transactionModel";

const TRANSACTION_COLLECTION = "transactions";
const COUNTER_COLLECTION = "count";
const TRANSACTION_COUNTER_DOC = "transactions";

export const getAllTransactionsFromDB = async (
  filters: TransactionFilter
): Promise<InventoryTransaction[]> => {
  let query: FirebaseFirestore.Query = db.collection(TRANSACTION_COLLECTION);

  if (filters.productId) {
    query = query.where("productId", "==", filters.productId);
  }

  if (filters.type) {
    query = query.where("type", "==", filters.type);
  }

  if (filters.startDate) {
    query = query.where("createdAt", ">=", filters.startDate);
  }

  if (filters.endDate) {
    query = query.where("createdAt", "<=", filters.endDate);
  }

  const snapshot = await query.get();

  return snapshot.docs.map((doc) => doc.data() as InventoryTransaction);
};

export const getTransactionByIdFromDB = async (
  id: string
): Promise<InventoryTransaction | null> => {
  const doc = await db.collection(TRANSACTION_COLLECTION).doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return doc.data() as InventoryTransaction;
};

export const getNextTransactionIdFromDB = async (): Promise<string> => {
  const counterRef = db.collection(COUNTER_COLLECTION).doc(TRANSACTION_COUNTER_DOC);

  const nextId = await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    let newIdNumber: number;

    if (!counterDoc.exists) {
      newIdNumber = 1;
      transaction.set(counterRef, { currentId: newIdNumber });
    } else {
      const currentId = counterDoc.data()?.currentId || 0;
      newIdNumber = currentId + 1;
      transaction.update(counterRef, { currentId: newIdNumber });
    }

    return `trans_${newIdNumber}`;
  });

  return nextId;
};

export const createTransactionInDB = async (
  newTransaction: InventoryTransaction
): Promise<InventoryTransaction> => {
  await db.collection(TRANSACTION_COLLECTION).doc(newTransaction.id).set(newTransaction);
  return newTransaction;
};

export const updateTransactionInDB = async (
  id: string,
  data: Partial<InventoryTransaction>
): Promise<InventoryTransaction | null> => {
  const docRef = db.collection(TRANSACTION_COLLECTION).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  const existingTransaction = doc.data() as InventoryTransaction;

  const updatedTransaction: InventoryTransaction = {
    ...existingTransaction,
    ...data,
    id: existingTransaction.id,
    updatedAt: new Date().toISOString()
  };

  await docRef.set(updatedTransaction);

  return updatedTransaction;
};

export const deleteTransactionFromDB = async (
  id: string
): Promise<InventoryTransaction | null> => {
  const docRef = db.collection(TRANSACTION_COLLECTION).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  const deletedTransaction = doc.data() as InventoryTransaction;

  await docRef.delete();
  return deletedTransaction;
};