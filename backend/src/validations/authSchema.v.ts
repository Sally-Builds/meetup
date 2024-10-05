import Joi from "joi";

export const RegisterValidation = Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(), // You can add custom regex or complexity rules for stronger password validation.
    interests: Joi.array().items(Joi.string()).min(1).required(),
    location: Joi.string().required(),
});

export const LoginValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(), // You can add custom regex or complexity rules for stronger password validation.
});
