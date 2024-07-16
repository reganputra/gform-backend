import express, { query } from "express";
import AuthController from "../controllers/AuthController.js";
import FormController from "../controllers/FormController.js";
import jwtAuth from "../middleware/jwtAuth.js";
import QuestionController from "../controllers/QuestionController.js";
import OptionController from "../controllers/OptionController.js";
import AnswerController from "../controllers/AnswerController.js";
import InviteController from "../controllers/InviteController.js";


const router = express.Router();

// Auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", jwtAuth(), AuthController.refreshToken);

// Form
router.get("/forms", jwtAuth(), FormController.index);
router.post("/forms", jwtAuth(), FormController.store);
router.get("/forms/:id", jwtAuth(), FormController.show);
router.put("/forms/:id", jwtAuth(), FormController.update);
router.delete("/forms/:id", jwtAuth(), FormController.destroy);
router.get("/forms/:id/users", jwtAuth(), FormController.showToUser);

// Question
router.get("/forms/:id/questions", jwtAuth(), QuestionController.index);
router.post("/forms/:id/questions", jwtAuth(), QuestionController.store);
router.put("/forms/:id/questions/:questionId", jwtAuth(), QuestionController.update);
router.delete("/forms/:id/questions/:questionId", jwtAuth(), QuestionController.destroy);

// Option
router.post("/forms/:id/questions/:questionId/options", jwtAuth(), OptionController.store);
router.put("/forms/:id/questions/:questionId/options/:optionId", jwtAuth(), OptionController.update);
router.delete("/forms/:id/questions/:questionId/options/:optionId", jwtAuth(), OptionController.destroy);

// Answer
router.post("/answers/:formId", jwtAuth(), AnswerController.store);

// Invites
router.get("/forms/:id/invites", jwtAuth(), InviteController.index);
router.post("/forms/:id/invites", jwtAuth(), InviteController.store);
router.delete("/forms/:id/invites", jwtAuth(), InviteController.destroy);

export default router;
