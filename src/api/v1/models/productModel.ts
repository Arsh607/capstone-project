export interface Product {
    id: string, 
    name: string,
    description: string, 
    price: number,
    quantity: number, 
    category: string,
    supplierId: string
}

export interface CreateProductInput {
    name: string,
    description: string, 
    price: number,
    quantity: number, 
    category: string,
    supplierId: string
};

export interface UpdateProductInput {
    name?: string,
    description?: string, 
    price?: number,
    quantity?: number, 
    category?: string,
    supplierId?: string
};