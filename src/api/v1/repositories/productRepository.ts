import { db } from "../../../config/firebaseConfig";
import { Product, UpdateProductInput } from '../models/productModel';

const PRODUCT_COLLECTION = 'products';
const COUNTER_COLLECTION = 'count';
const PRODUCT_COUNTER_DOC = 'products';

export const getAllProducts = async (): Promise<Product[]> => {
    const snapshot = await db.
        collection(PRODUCT_COLLECTION).
        orderBy("id").
        get();

    return snapshot.docs.map((doc) => doc.data() as Product);
                            
};

export const getProductById = async(id: string): Promise<Product | null> => {
    const doc = await db.collection(PRODUCT_COLLECTION).doc(id).get();

    if (!doc.exists) {
        return null;
    }

    return doc.data() as Product;
}


export const getNextProductIdFromDB = async (): Promise<string> => {
  const counterRef = db
    .collection(COUNTER_COLLECTION)
    .doc(PRODUCT_COUNTER_DOC);

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

    return `prod_${newIdNumber}`;
  });

  return nextId;
};

export const createNewProduct = async(product: Product): Promise<Product> => {
    await db.collection(PRODUCT_COLLECTION).
        doc(product.id).
        set(product);

    return product;
}

export const updateProductFromDB = async(id: string, data: Partial<Product>): Promise<Product | null> => {
    const docRef = db.collection(PRODUCT_COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return null;
    } 
    
    const existingProduct = doc.data() as Product;
    const updatedProduct: Product = {
        ...existingProduct,
        ...data,
        id: existingProduct.id
    }

    await docRef.set(updatedProduct);

    return updatedProduct;
    
};

export const deleteProductFromDB = async(id: string): Promise<Product | null> => {
    const docRef = db.collection(PRODUCT_COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return null;
    }

    const deletedProduct = doc.data() as Product;

    await docRef.delete();
    return deletedProduct;
}
