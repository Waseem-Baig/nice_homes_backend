import express from "express";
import {
  createPartner,
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
  getMyPartnerSubmissions,
} from "../controllers/partnerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { partnerValidation } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public route - create partner submission
router.post("/", partnerValidation, createPartner);

// Protected routes - user's own submissions
router.get("/my-submissions", protect, getMyPartnerSubmissions);

// Admin routes
router.get("/", protect, admin, getAllPartners);
router.get("/:id", protect, admin, getPartnerById);
router.put("/:id", protect, admin, updatePartner);
router.delete("/:id", protect, admin, deletePartner);

export default router;
