import Joi from "joi";

export const createSupplierValidation = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().min(1).email().required(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    address: Joi.string().required()
});

export const updateSupplierValidation = Joi.object({
    name: Joi.string().min(1),
    email: Joi.string().min(1).email(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
    address: Joi.string()
})