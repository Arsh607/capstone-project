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

export const transactionIdValidation = Joi.object({
    id: Joi.string().pattern(/^trans_\d+$/).required()
});

export const transactionFilterValidation = Joi.object({
  productId: Joi.string().pattern(/^prod_\d+$/),
  type: Joi.string().valid("add", "remove", "adjust"),
  startDate: Joi.string().isoDate(),
  endDate: Joi.string().isoDate(),
})
  .with("startDate", "endDate") 
  .with("endDate", "startDate")
  .custom((value, helpers) => {
    if (value.startDate && value.endDate) {
      if (new Date(value.startDate) > new Date(value.endDate)) {
        return helpers.error("any.invalid");
      }
    }
    return value;
  }, "Date range validation")
  .messages({
    "any.invalid": "startDate cannot be greater than endDate",
  })