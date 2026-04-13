export interface Supplier {
    id: string,
    name: string,
    email: string,
    phoneNumber: string,
    address: string
};

export interface CreateSupplier {
    name: string,
    email: string,
    phoneNumber: string,
    address: string
};

export interface UpdateSupplier {
    name?: string,
    email?: string,
    phoneNumber?: string,
    address?: string  
};