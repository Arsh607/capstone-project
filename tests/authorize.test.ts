import { isAuthorized } from "../src/api/v1/middleware/authorize";
import { HTTP_STATUS } from "../src/constants/httpsConstants";
import { Request, Response, NextFunction } from "express";

describe("isAuthorized middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      locals: {},
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should call next with AppError when no role is found", () => {
    const middleware = isAuthorized({ hasRole: ["admin"] });

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Forbidden: NO ROLE FOUND", // ✅ FIXED
        statusCode: HTTP_STATUS.FORBIDDEN,
      })
    );
  });

  it("should call next with AppError when user role is not allowed", () => {
    res.locals = {
      role: "employee",
    };

    const middleware = isAuthorized({ hasRole: ["admin", "manager"] });

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Forbidden: INSUFFICIENT ROLE", // ✅ FIXED
        statusCode: HTTP_STATUS.FORBIDDEN,
      })
    );
  });

  it("should call next when user role is allowed (admin)", () => {
    res.locals = {
      role: "admin",
    };

    const middleware = isAuthorized({ hasRole: ["admin", "manager"] });

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should call next when user role is allowed (manager)", () => {
    res.locals = {
      role: "manager",
    };

    const middleware = isAuthorized({ hasRole: ["admin", "manager"] });

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
  });
});