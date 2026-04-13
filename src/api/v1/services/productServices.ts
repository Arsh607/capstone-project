import * as productRepository from '../repositories/productRepository';
import * as supplierRepository from '../repositories/supplierRepository';
import { CreateProductInput, Product, UpdateProductInput } from '../models/productModel';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../../../constants/httpsConstants';

export const getAll = (): Promise<Product[]> => {
  return productRepository.getAllProducts();
};

export const getById = (id: string): Promise<Product | null> => {
  return productRepository.getProductById(id);
};

export const createProduct = async (data: CreateProductInput): Promise<Product> => {
  const supplier = await supplierRepository.getSupplierByIdFromDb(data.supplierId);

  if (!supplier) {
    throw new AppError('Supplier not found', HTTP_STATUS.NOT_FOUND);
  }

  const nextId = await productRepository.getNextProductIdFromDB();

  const newProduct: Product = {
    id: nextId,
    ...data
  };

  return productRepository.createNewProduct(newProduct);
};

export const updateProduct = async (
  id: string,
  data: UpdateProductInput
): Promise<Product | null> => {
  if (data.supplierId) {
    const supplier = await supplierRepository.getSupplierByIdFromDb(data.supplierId);

    if (!supplier) {
      throw new AppError('Supplier not found', HTTP_STATUS.NOT_FOUND);
    }
  }

  return productRepository.updateProductFromDB(id, data);
};

export const deleteProduct = (id: string): Promise<Product | null> => {
  return productRepository.deleteProductFromDB(id);
};