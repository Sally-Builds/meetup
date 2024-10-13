import Joi from "joi";

export const UpdateUserValidation = Joi.object({
    full_name: Joi.string().optional(),
    dob: Joi.string().optional(),
    phone: Joi.string().optional().min(9).max(16),
    occupation: Joi.string().optional(),
    gender: Joi.string().valid("male", "female"),
    interests: Joi.array().items(Joi.string()).min(1).optional(),
    location: Joi.string().optional(),
})