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
import * as transactionServices from "../src/api/v1/services/transactionServices";
import * as transactionRepository from "../src/api/v1/repositories/transactionRepository";
import * as productRepository from "../src/api/v1/repositories/productRepository";
import { AppError } from "../src/api/v1/utils/AppError";
import { HTTP_STATUS } from "../src/constants/httpsConstants";

jest.mock("../src/api/v1/repositories/transactionRepository");
jest.mock("../src/api/v1/repositories/productRepository");

const mockedTransactionRepository = transactionRepository as jest.Mocked<typeof transactionRepository>;
const mockedProductRepository = productRepository as jest.Mocked<typeof productRepository>;

describe("transactionServices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTransactions", () => {
    it("should return all transactions", async () => {
      const transactions = [
        {
          id: "trans_1",
          productId: "prod_1",
          quantityChanged: 5,
          type: "add",
          notes: "Restocked",
          createdAt: "2026-04-07T00:00:00.000Z",
        },
      ];

      mockedTransactionRepository.getAllTransactionsFromDB.mockResolvedValue(transactions as any);

      const result = await transactionServices.getAllTransactions();

      expect(result).toEqual(transactions);
    });
  });

  describe("getTransactionById", () => {
    it("should return transaction when found", async () => {
      const transaction = {
        id: "trans_1",
        productId: "prod_1",
        quantityChanged: 5,
        type: "add",
        notes: "Restocked",
        createdAt: "2026-04-07T00:00:00.000Z",
      };

      mockedTransactionRepository.getTransactionByIdFromDB.mockResolvedValue(transaction as any);

      const result = await transactionServices.getTransactionById("trans_1");

      expect(result).toEqual(transaction);
    });

    it("should throw AppError when transaction not found", async () => {
      mockedTransactionRepository.getTransactionByIdFromDB.mockResolvedValue(null);

      await expect(transactionServices.getTransactionById("trans_999")).rejects.toMatchObject({
        message: "Transaction not found",
        statusCode: HTTP_STATUS.NOT_FOUND,
      });
    });
  });

  describe("createTransaction", () => {
    it("should create an add transaction and increase product quantity", async () => {
      const product = {
        id: "prod_1",
        name: "iPhone",
        description: "Phone",
        price: 1000,
        quantity: 5,
        category: "Electronics",
        supplierId: "supp_1",
      };

      const input = {
        productId: "prod_1",
        quantityChanged: 3,
        type: "add" as const,
        notes: "Restocked",
      };

      mockedProductRepository.getProductById.mockResolvedValue(product);
      mockedProductRepository.updateProductFromDB.mockResolvedValue({
        ...product,
        quantity: 8,
      });
      mockedTransactionRepository.getNextTransactionIdFromDB.mockResolvedValue("trans_1");
      mockedTransactionRepository.createTransactionInDB.mockImplementation(async (t: any) => t);

      const result = await transactionServices.createTransaction(input);

      expect(mockedProductRepository.updateProductFromDB).toHaveBeenCalledWith("prod_1", {
        quantity: 8,
      });
      expect(result.id).toBe("trans_1");
      expect(result.productId).toBe("prod_1");
      expect(result.type).toBe("add");
      expect(result.createdAt).toBeDefined();
    });

    it("should create a remove transaction and decrease product quantity", async () => {
      const product = {
        id: "prod_1",
        name: "iPhone",
        description: "Phone",
        price: 1000,
        quantity: 10,
        category: "Electronics",
        supplierId: "supp_1",
      };

      const input = {
        productId: "prod_1",
        quantityChanged: 4,
        type: "remove" as const,
        notes: "Sold stock",
      };

      mockedProductRepository.getProductById.mockResolvedValue(product);
      mockedProductRepository.updateProductFromDB.mockResolvedValue({
        ...product,
        quantity: 6,
      });
      mockedTransactionRepository.getNextTransactionIdFromDB.mockResolvedValue("trans_2");
      mockedTransactionRepository.createTransactionInDB.mockImplementation(async (t: any) => t);

      const result = await transactionServices.createTransaction(input);

      expect(mockedProductRepository.updateProductFromDB).toHaveBeenCalledWith("prod_1", {
        quantity: 6,
      });
      expect(result.type).toBe("remove");
    });

    it("should create an adjust transaction and set the product quantity", async () => {
      const product = {
        id: "prod_1",
        name: "iPhone",
        description: "Phone",
        price: 1000,
        quantity: 10,
        category: "Electronics",
        supplierId: "supp_1",
      };

      const input = {
        productId: "prod_1",
        quantityChanged: 7,
        type: "adjust" as const,
        notes: "Manual adjustment",
      };

      mockedProductRepository.getProductById.mockResolvedValue(product);
      mockedProductRepository.updateProductFromDB.mockResolvedValue({
        ...product,
        quantity: 7,
      });
      mockedTransactionRepository.getNextTransactionIdFromDB.mockResolvedValue("trans_3");
      mockedTransactionRepository.createTransactionInDB.mockImplementation(async (t: any) => t);

      const result = await transactionServices.createTransaction(input);

      expect(mockedProductRepository.updateProductFromDB).toHaveBeenCalledWith("prod_1", {
        quantity: 7,
      });
      expect(result.type).toBe("adjust");
    });

    it("should throw AppError when product does not exist", async () => {
      mockedProductRepository.getProductById.mockResolvedValue(null);

      await expect(
        transactionServices.createTransaction({
          productId: "prod_999",
          quantityChanged: 3,
          type: "add",
          notes: "Restocked",
        })
      ).rejects.toMatchObject({
        message: "Product not found",
        statusCode: HTTP_STATUS.NOT_FOUND,
      });
    });

    it("should throw AppError when stock is insufficient for remove", async () => {
      mockedProductRepository.getProductById.mockResolvedValue({
        id: "prod_1",
        name: "iPhone",
        description: "Phone",
        price: 1000,
        quantity: 2,
        category: "Electronics",
        supplierId: "supp_1",
      });

      await expect(
        transactionServices.createTransaction({
          productId: "prod_1",
          quantityChanged: 5,
          type: "remove",
          notes: "Sold stock",
        })
      ).rejects.toMatchObject({
        message: "Insufficient stock",
        statusCode: HTTP_STATUS.BAD_REQUEST,
      });
    });
  });

  describe("updateTransaction", () => {
    it("should update a transaction", async () => {
      const updated = {
        id: "trans_1",
        productId: "prod_1",
        quantityChanged: 5,
        type: "add",
        notes: "Updated note",
        createdAt: "2026-04-07T00:00:00.000Z",
        updatedAt: "2026-04-07T01:00:00.000Z",
      };

      mockedTransactionRepository.updateTransactionInDB.mockResolvedValue(updated as any);

      const result = await transactionServices.updateTransaction("trans_1", {
        notes: "Updated note",
      });

      expect(result).toEqual(updated);
    });

    it("should throw AppError when transaction not found on update", async () => {
      mockedTransactionRepository.updateTransactionInDB.mockResolvedValue(null);

      await expect(
        transactionServices.updateTransaction("trans_999", { notes: "Updated note" })
      ).rejects.toMatchObject({
        message: "Transaction not found",
        statusCode: HTTP_STATUS.NOT_FOUND,
      });
    });
  });

  describe("deleteTransaction", () => {
    it("should delete a transaction", async () => {
      const deleted = {
        id: "trans_1",
        productId: "prod_1",
        quantityChanged: 5,
        type: "add",
        notes: "Restocked",
        createdAt: "2026-04-07T00:00:00.000Z",
      };

      mockedTransactionRepository.deleteTransactionFromDB.mockResolvedValue(deleted as any);

      const result = await transactionServices.deleteTransaction("trans_1");

      expect(result).toEqual(deleted);
    });

    it("should throw AppError when transaction not found on delete", async () => {
      mockedTransactionRepository.deleteTransactionFromDB.mockResolvedValue(null);

      await expect(transactionServices.deleteTransaction("trans_999")).rejects.toMatchObject({
        message: "Transaction not found",
        statusCode: HTTP_STATUS.NOT_FOUND,
      });
    });
  });
});