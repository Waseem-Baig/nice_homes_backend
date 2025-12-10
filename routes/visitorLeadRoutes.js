import express from "express";
import {
  createVisitorLead,
  getAllVisitorLeads,
  updateLeadStatus,
  deleteVisitorLead,
} from "../controllers/visitorLeadController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.post("/", createVisitorLead);

// Admin routes
router.get("/admin/all", protect, admin, getAllVisitorLeads);
router.put("/:id/status", protect, admin, updateLeadStatus);
router.delete("/:id", protect, admin, deleteVisitorLead);

export default router;
