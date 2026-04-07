import Joi from "joi";

export const createTransactionValidation = Joi.object({
    productId: Joi.string().pattern(/^prod_\d+$/).required(),
    quantityChanged: Joi.number().min(1).required(),
    type: Joi.string().valid("add", "remove", "adjust").required(),
    notes: Joi.string().min(1).max(500).optional()
}).unknown(false);

export const updateTransactionValidation = Joi.object({
  notes: Joi.string().min(1).max(500),
  type: Joi.string().valid("add", "remove", "adjust")
})
  .min(1)
  .unknown(false);
