import Joi from "joi";

export const sendChatValidation = Joi.object({
    content: Joi.string().required(),
    to: Joi.string().required()
})