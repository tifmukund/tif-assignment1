import Joi from "joi";

const validator = (schema) => (payload) => schema.validate(payload)


const signupSchema = Joi.object({
    name:Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password:Joi.string().min(6).required()
})

const createCommunitySchema = Joi.object({
    name:Joi.string().min(2).required(),
})

const roleSchema = Joi.object({
    name:Joi.string().min(2).required(),
})
console.log("validator called");
export const validateSignup = validator(signupSchema);
export const validateCreateCommunity = validator(createCommunitySchema);
export const validateCreateRole = validator(roleSchema);
