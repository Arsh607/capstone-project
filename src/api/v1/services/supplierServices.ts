import * as supplierRepository from '../repositories/supplierRepository';
import { Supplier, UpdateSupplier, CreateSupplier } from '../models/supplierModel';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../../../constants/httpsConstants';

export const getAllSuppliers = async (): Promise<Supplier[]> => {
  return supplierRepository.getAllSuppliersFromDb();
};

export const getById = async (id: string): Promise<Supplier> => {
  const supplier = await supplierRepository.getSupplierByIdFromDb(id);

  if (!supplier) {
    throw new AppError('Supplier not found', HTTP_STATUS.NOT_FOUND);
  }

  return supplier;
};

export const createNewSupplier = async (data: CreateSupplier): Promise<Supplier> => {
  const nextId = await supplierRepository.getNextSupplierId();

  const newSupplier: Supplier = {
    id: nextId,
    ...data
  };

  return supplierRepository.createSupplier(newSupplier);
};

export const update = async (
  id: string,
  data: UpdateSupplier
): Promise<Supplier> => {
  const updatedSupplier = await supplierRepository.updateSupplier(id, data);

  if (!updatedSupplier) {
    throw new AppError('Supplier not found', HTTP_STATUS.NOT_FOUND);
  }

  return updatedSupplier;
};

export const deleteSupplier = async (id: string): Promise<Supplier> => {
  const deletedSupplier = await supplierRepository.deleteSupplierFromDb(id);

  if (!deletedSupplier) {
    throw new AppError('Supplier not found', HTTP_STATUS.NOT_FOUND);
  }

  return deletedSupplier;
};