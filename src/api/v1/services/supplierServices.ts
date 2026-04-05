import * as supplierRepository from '../repositories/supplierRepository';
import { Supplier, UpdateSupplier, CreateSupplier } from '../models/supplierModel';

export const getAllSuppliers = async(): Promise<Supplier[]> => {
    return supplierRepository.getAllSuppliersFromDb();
};

export const getById = async(id: string): Promise<Supplier | null> => {
    return supplierRepository.getSupplierByIdFromDb(id);
};

export const createNewSupplier = async(data: CreateSupplier): Promise<Supplier> => {
    const nextId = await supplierRepository.getNextSupplierId();
    const newSupplier: Supplier = {
        id: nextId,
        ...data
    }

    return supplierRepository.createSupplier(newSupplier);
};

export const update = async(id: string, data: UpdateSupplier): Promise<Supplier | null> => {
    return supplierRepository.updateSupplier(id, data);
};

export const deleteSupplier = async(id: string): Promise<Supplier | null> => {
    return supplierRepository.deleteSupplierFromDb(id);
};