import Joi from "joi";

export const CreateEventValidation = Joi.object({
    name: Joi.string().required(),
    activities: Joi.array().items(Joi.string()).required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    location: Joi.string().required(),
    expected_attendees: Joi.number().integer().min(3).required(),
});
;
