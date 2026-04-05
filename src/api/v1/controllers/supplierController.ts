import { HTTP_STATUS } from "../../../constants/httpsConstants";
import { Request, Response, NextFunction } from "express";
import * as supplierService from "../services/supplierServices";
import { UpdateSupplier, CreateSupplier, Supplier} from "../models/supplierModel";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const getAllSuppliers = await supplierService.getAllSuppliers();

    res.status(HTTP_STATUS.OK).json({
      message: "Suppliers retrieved successfully",
      count: getAllSuppliers.length,
      data: getAllSuppliers,
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const getSupplierById = await supplierService.getById(id);

    if (!getSupplierById) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Supplier not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Supplier retrieved successfully",
      data: getSupplierById,
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phoneNumber, address } = req.body;
    
    const createSupplier = await supplierService.createNewSupplier({
      name,
      email,
      phoneNumber,
      address
    });

    res.status(HTTP_STATUS.CREATED).json({
      message: "Supplier created successfully",
      data: createSupplier,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updateSupplier = await supplierService.update(id, req.body);

    if (!updateSupplier) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Supplier not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Supplier updated successfully",
      data: updateSupplier,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const deleteSupplierById = await supplierService.deleteSupplier(id);

    if (!deleteSupplierById) {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Supplier not found",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      message: "Supplier deleted successfully",
      data: deleteSupplierById,
    });
  } catch (error) {
    next(error);
  }
};