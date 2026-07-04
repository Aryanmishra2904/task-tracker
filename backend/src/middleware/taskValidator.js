import { body, param, validationResult } from "express-validator";

const optionalFieldRules = [
  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["todo", "in-progress", "done"])
    .withMessage("Status must be one of: todo, in-progress, done"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),

  body("dueDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Due date must be a valid date (ISO 8601)"),
];


const createTaskRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  ...optionalFieldRules,
];

const updateTaskRules = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  ...optionalFieldRules,
];

const mongoIdRule = [
  param("id")
    .isMongoId()
    .withMessage("Invalid task id"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  next();
};

export {
  createTaskRules,
  updateTaskRules,
  mongoIdRule,
  validate,
};