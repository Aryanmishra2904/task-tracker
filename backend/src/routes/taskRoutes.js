import express from "express";

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import {
  createTaskRules,
  updateTaskRules,
  mongoIdRule,
  validate,
} from "../middleware/taskValidator.js";

const router = express.Router();

// GET  /api/tasks      - list tasks
// POST /api/tasks      - create task
router
  .route("/")
  .get(getTasks)
  .post(createTaskRules, validate, createTask);

// GET    /api/tasks/:id - get a task
// PUT    /api/tasks/:id - update a task
// DELETE /api/tasks/:id - delete a task
router
  .route("/:id")
  .get(mongoIdRule, validate, getTaskById)
  .put(mongoIdRule, updateTaskRules, validate, updateTask)
  .delete(mongoIdRule, validate, deleteTask);

export default router;