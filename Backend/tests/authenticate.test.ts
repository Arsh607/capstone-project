jest.mock("../src/config/firebaseConfig", () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

import { authenticate } from "../src/api/v1/middleware/authenticate";
import { auth } from "../src/config/firebaseConfig";
import { HTTP_STATUS } from "../src/constants/httpsConstants";
import { Request, Response, NextFunction } from "express";

const mockedAuth = auth as jest.Mocked<typeof auth>;

describe("authenticate middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      locals: {},
    };

    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should call next with AppError when authorization header is missing", async () => {
    await authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Unauthorized: NO TOKEN PROVIDED",
        statusCode: HTTP_STATUS.UNAUTHORIZED,
      })
    );
  });

  it("should call next with AppError when authorization header format is invalid", async () => {
    req.headers = {
      authorization: "InvalidTokenFormat",
    };

    await authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Unauthorized: INVALID TOKEN FORMAT",
        statusCode: HTTP_STATUS.UNAUTHORIZED,
      })
    );
  });

  it("should call next with AppError when bearer token is missing", async () => {
    req.headers = {
      authorization: "Bearer ",
    };

    await authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Unauthorized: MISSING TOKEN",
        statusCode: HTTP_STATUS.UNAUTHORIZED,
      })
    );
  });

  it("should verify token, store uid and role in res.locals, and call next on success", async () => {
    req.headers = {
      authorization: "Bearer valid-token",
    };

    mockedAuth.verifyIdToken.mockResolvedValue({
      uid: "user_123",
      role: "admin",
    } as any);

    await authenticate(req as Request, res as Response, next);

    expect(mockedAuth.verifyIdToken).toHaveBeenCalledWith("valid-token");
    expect(res.locals?.uid).toBe("user_123");
    expect(res.locals?.role).toBe("admin");
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next with AppError when token verification fails", async () => {
    req.headers = {
      authorization: "Bearer bad-token",
    };

    mockedAuth.verifyIdToken.mockRejectedValue(new Error("Invalid token"));

    await authenticate(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Unauthorized: INVALID TOKEN",
        statusCode: HTTP_STATUS.UNAUTHORIZED,
      })
    );
  });
});