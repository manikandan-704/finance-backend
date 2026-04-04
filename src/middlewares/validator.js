const Joi = require("joi");

// Blueprint for User Registration
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("Viewer", "Analyst", "Admin").optional(),
});

// Blueprint for Creating/Updating a Financial Record
const recordSchema = Joi.object({
  amount: Joi.number().positive().required(), // Must be a positive number
  type: Joi.string().valid("income", "expense").required(), // Exactly these words
  category: Joi.string().min(2).max(50).required(),
  date: Joi.date().iso().optional(),
  notes: Joi.string().max(500).optional().allow(""),
});

// The actual middleware function
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Extract the specific error messages to send back a clean response
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({ success: false, message: errorMessage });
    }

    next(); // Data is perfect, move on to the controller!
  };
};

module.exports = {
  registerSchema,
  recordSchema,
  validate,
};
