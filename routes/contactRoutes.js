import express from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  getMyContactSubmissions,
} from "../controllers/contactController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { contactValidation } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public route - create contact submission
router.post("/", contactValidation, createContact);

// Protected routes - user's own submissions
router.get("/my-submissions", protect, getMyContactSubmissions);

// Admin routes
router.get("/", protect, admin, getAllContacts);
router.get("/:id", protect, admin, getContactById);
router.put("/:id", protect, admin, updateContact);
router.delete("/:id", protect, admin, deleteContact);

export default router;
