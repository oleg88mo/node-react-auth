const Joi = require('@hapi/joi');
// register validation
const registerValidation = data => {
    const schema = {
        name: Joi.string().min(2).required(),
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required(),
        phone: Joi.string().allow('').optional(),
        country: Joi.string().allow('').optional(),
        avatar: Joi.string().allow('').optional(),
    };

    return Joi.validate(data, schema);
};
// login validation
const loginValidation = (data) => {
    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    };

    return Joi.validate(data, schema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
