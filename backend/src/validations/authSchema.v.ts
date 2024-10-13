import Joi from "joi";

export const RegisterValidation = Joi.object({
    full_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    dob: Joi.string().required(),
    username: Joi.string().min(2).max(50).required(),
    phone: Joi.string().required().min(9).max(16),
    occupation: Joi.string().required(),
    gender: Joi.string().valid("male", "female"),
    password: Joi.string().min(8).required(),
    // interests: Joi.array().items(Joi.string()).min(1).required(),
    // location: Joi.string().required(),
});

export const LoginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(), // You can add custom regex or complexity rules for stronger password validation.
});
