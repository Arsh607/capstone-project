jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    verifyIdToken: jest.fn(),
    getUser: jest.fn(),
  },
  db: {
    collection: jest.fn(),
    runTransaction: jest.fn(),
    batch: jest.fn(),
  },
}));

import * as productServices from "../src/api/v1/services/productServices";
import * as productRepository from "../src/api/v1/repositories/productRepository";
import * as supplierRepository from "../src/api/v1/repositories/supplierRepository";
import { AppError } from "../src/api/v1/utils/AppError";
import { HTTP_STATUS } from "../src/constants/httpsConstants";

jest.mock("../src/api/v1/repositories/productRepository");
jest.mock("../src/api/v1/repositories/supplierRepository");

const mockedProductRepository = productRepository as jest.Mocked<typeof productRepository>;
const mockedSupplierRepository = supplierRepository as jest.Mocked<typeof supplierRepository>;

describe("productServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all products", async () => {
      const products = [
        {
          id: "prod_1",
          name: "iPhone",
          description: "Phone",
          price: 1000,
          quantity: 5,
          category: "Electronics",
          supplierId: "supp_1",
        },
      ];

      mockedProductRepository.getAllProducts.mockResolvedValue(products);

      const result = await productServices.getAll({});

      expect(result).toEqual(products);
      expect(mockedProductRepository.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe("getById", () => {
    it("should return a product when found", async () => {
      const product = {
        id: "prod_1",
        name: "iPhone",
        description: "Phone",
        price: 1000,
        quantity: 5,
        category: "Electronics",
        supplierId: "supp_1",
      };

      mockedProductRepository.getProductById.mockResolvedValue(product);

      const result = await productServices.getById("prod_1");

      expect(result).toEqual(product);
      expect(mockedProductRepository.getProductById).toHaveBeenCalledWith("prod_1");
    });

    it("should return null when product is not found", async () => {
      mockedProductRepository.getProductById.mockResolvedValue(null);

      const result = await productServices.getById("prod_999");

      expect(result).toBeNull();
    });
  });

  describe("createProduct", () => {
    it("should create a product when supplier exists", async () => {
      const input = {
        name: "iPhone",
        description: "Phone",
        price: 1000,
        quantity: 5,
        category: "Electronics",
        supplierId: "supp_1",
      };

      const createdProduct = {
        id: "prod_1",
        ...input,
      };

      mockedSupplierRepository.getSupplierByIdFromDb.mockResolvedValue({
        id: "supp_1",
        name: "Apple Supplier",
        email: "apple@test.com",
        phoneNumber: "2041234567",
        address: "Winnipeg",
      });

      mockedProductRepository.getNextProductIdFromDB.mockResolvedValue("prod_1");
      mockedProductRepository.createNewProduct.mockResolvedValue(createdProduct);

      const result = await productServices.createProduct(input);

      expect(mockedSupplierRepository.getSupplierByIdFromDb).toHaveBeenCalledWith("supp_1");
      expect(mockedProductRepository.getNextProductIdFromDB).toHaveBeenCalled();
      expect(mockedProductRepository.createNewProduct).toHaveBeenCalledWith(createdProduct);
      expect(result).toEqual(createdProduct);
    });

    it("should throw AppError when supplier does not exist", async () => {
      const input = {
        name: "iPhone",
        description: "Phone",
        price: 1000,
        quantity: 5,
        category: "Electronics",
        supplierId: "supp_999",
      };

      mockedSupplierRepository.getSupplierByIdFromDb.mockResolvedValue(null);

      await expect(productServices.createProduct(input)).rejects.toBeInstanceOf(AppError);
      await expect(productServices.createProduct(input)).rejects.toMatchObject({
        message: "Supplier not found",
        statusCode: HTTP_STATUS.NOT_FOUND,
      });
    });
  });

  describe("updateProduct", () => {
    it("should update a product when supplierId is not being changed", async () => {
      const updated = {
        id: "prod_1",
        name: "Updated iPhone",
        description: "Phone",
        price: 1200,
        quantity: 5,
        category: "Electronics",
        supplierId: "supp_1",
      };

      mockedProductRepository.updateProductFromDB.mockResolvedValue(updated);

      const result = await productServices.updateProduct("prod_1", {
        name: "Updated iPhone",
        price: 1200,
      });

      expect(mockedProductRepository.updateProductFromDB).toHaveBeenCalledWith("prod_1", {
        name: "Updated iPhone",
        price: 1200,
      });
      expect(result).toEqual(updated);
    });

    it("should validate supplier when supplierId is being changed", async () => {
      const updated = {
        id: "prod_1",
        name: "iPhone",
        description: "Phone",
        price: 1000,
        quantity: 5,
        category: "Electronics",
        supplierId: "supp_2",
      };

      mockedSupplierRepository.getSupplierByIdFromDb.mockResolvedValue({
        id: "supp_2",
        name: "New Supplier",
        email: "new@test.com",
        phoneNumber: "2041234567",
        address: "Winnipeg",
      });

      mockedProductRepository.updateProductFromDB.mockResolvedValue(updated);

      const result = await productServices.updateProduct("prod_1", {
        supplierId: "supp_2",
      });

      expect(mockedSupplierRepository.getSupplierByIdFromDb).toHaveBeenCalledWith("supp_2");
      expect(result).toEqual(updated);
    });

    it("should throw AppError when updated supplierId does not exist", async () => {
      mockedSupplierRepository.getSupplierByIdFromDb.mockResolvedValue(null);

      await expect(
        productServices.updateProduct("prod_1", { supplierId: "supp_999" })
      ).rejects.toMatchObject({
        message: "Supplier not found",
        statusCode: HTTP_STATUS.NOT_FOUND,
      });
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      const deleted = {
        id: "prod_1",
        name: "iPhone",
        description: "Phone",
        price: 1000,
        quantity: 5,
        category: "Electronics",
        supplierId: "supp_1",
      };

      mockedProductRepository.deleteProductFromDB.mockResolvedValue(deleted);

      const result = await productServices.deleteProduct("prod_1");

      expect(mockedProductRepository.deleteProductFromDB).toHaveBeenCalledWith("prod_1");
      expect(result).toEqual(deleted);
    });
  });
});