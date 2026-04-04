import * as productRepository from '../repositories/productRepository';
import { CreateProductInput, Product, UpdateProductInput } from '../models/productModel';

export const getAll = (): Promise<Product[]> => {
    return productRepository.getAllProducts();
};

export const getById = (id: string): Promise<Product | null> => {
    return productRepository.getProductById(id);
};

export const createProduct = async (data: CreateProductInput): Promise<Product> => {
    const nextId = await productRepository.getNextProductIdFromDB();

    const newProduct: Product = {
        id: nextId,
        ...data
    };

    return productRepository.createNewProduct(newProduct);
};

export const updateProduct = (id: string, data: UpdateProductInput): Promise<Product | null> => {
    return productRepository.updateProductFromDB(id, data);
};

export const deleteProduct = (id: string): Promise<Product | null> => {
    return productRepository.deleteProductFromDB(id);
};