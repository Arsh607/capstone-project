import * as productRepository from '../repositories/productRepository';
import * as supplierRepository from '../repositories/supplierRepository';
import { CreateProductInput, Product, ProductFilter, UpdateProductInput } from '../models/productModel';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../../../constants/httpsConstants';

export const getAll = (filters: ProductFilter): Promise<Product[]> => {
  if (
  filters.minPrice !== undefined &&
  filters.maxPrice !== undefined &&
  filters.minPrice > filters.maxPrice
  ) {
    throw new AppError("minPrice cannot be greater than maxPrice", HTTP_STATUS.BAD_REQUEST);
  }

  if (
  filters.minQuantity !== undefined &&
  filters.maxQuantity !== undefined &&
  filters.minQuantity > filters.maxQuantity
) {
  throw new AppError("minQuantity cannot be greater than maxQuantity", HTTP_STATUS.BAD_REQUEST);
}
  return productRepository.getAllProducts(filters);
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