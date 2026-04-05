import { db } from "../../../config/firebaseConfig";
import { Supplier, UpdateSupplier } from "../models/supplierModel";

const SUPPLIER_COLLECTION = "suppliers";
const COUNTER_COLLECTION_SUPPLIER = "counters";
const SUPPLIER_COUNTER_DOC = "supplier";

export const getAllSuppliersFromDb = async (): Promise<Supplier[]> => {
  const snapshot = await db.collection(SUPPLIER_COLLECTION).orderBy("id").get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Supplier, "id">),
  })) as Supplier[];
};

export const getSupplierByIdFromDb = async (id: string): Promise<Supplier | null> => {
  const doc = await db.collection(SUPPLIER_COLLECTION).doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...(doc.data() as Omit<Supplier, "id">),
  } as Supplier;
};

export const getNextSupplierId = async (): Promise<string> => {
  const countRef = db.collection(COUNTER_COLLECTION_SUPPLIER).doc(SUPPLIER_COUNTER_DOC);

  const nextId = await db.runTransaction(async (transaction) => {
    const counterDoc = await transaction.get(countRef);
    let newIdNumber: number;

    if (!counterDoc.exists) {
      newIdNumber = 1;
      transaction.set(countRef, { currentId: newIdNumber });
    } else {
      const currentId = counterDoc.data()?.currentId || 0;
      newIdNumber = currentId + 1;
      transaction.update(countRef, { currentId: newIdNumber });
    }

    return `supp_${newIdNumber}`;
  });

  return nextId;
};

export const createSupplier = async (supplier: Supplier): Promise<Supplier> => {
  await db.collection(SUPPLIER_COLLECTION).doc(supplier.id).set(supplier);
  return supplier;
};

export const updateSupplier = async (
  id: string,
  data: Partial<UpdateSupplier>
): Promise<Supplier | null> => {
  const docRef = db.collection(SUPPLIER_COLLECTION).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  const existingSupplier = doc.data() as Supplier;

  const updatedSupplier: Supplier = {
    ...existingSupplier,
    ...data,
    id: existingSupplier.id,
  };

  await docRef.set(updatedSupplier);

  return updatedSupplier;
};

export const deleteSupplierFromDb = async (id: string): Promise<Supplier | null> => {
  const docRef = db.collection(SUPPLIER_COLLECTION).doc(id);
  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  const deletedSupplier: Supplier = {
    id: doc.id,
    ...(doc.data() as Omit<Supplier, "id">),
  };

  await docRef.delete();
  return deletedSupplier;
};