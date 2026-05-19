import Joi from "joi";

export const createProductValidation = Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required(),
    category: Joi.string().valid("Electronics", "Office Supplies", "Furniture", "Food", "Home Supplies").required(),
    supplierId: Joi.string().pattern(/^supp_\d+$/).required()
}).unknown(false);

export const updateProductValidation = Joi.object({
    name: Joi.string().min(1),
    description: Joi.string().min(1),
    price: Joi.number().min(0),
    quantity: Joi.number().min(0),
    category: Joi.string().valid("Electronics", "Office Supplies", "Furniture", "Food", "Home Supplies"),
    supplierId: Joi.string().pattern(/^supp_\d+$/)
}).min(1).unknown(false);

export const productIdValidation = Joi.object({
    id: Joi.string().pattern(/^prod_\d+$/).required()
});

export const productFilterValidation = Joi.object({
  category: Joi.string().valid(
    "Electronics",
    "Office Supplies",
    "Furniture",
    "Food",
    "Home Supplies"
  ),
  supplierId: Joi.string().pattern(/^supp_\d+$/),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  minQuantity: Joi.number().min(0),
  maxQuantity: Joi.number().min(0),
});