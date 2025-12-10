import VisitorLead from "../models/VisitorLead.js";

// @desc    Create a new visitor lead
// @route   POST /api/visitor-leads
// @access  Public
export const createVisitorLead = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Validate input
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide name and phone number",
      });
    }

    // Create visitor lead
    const visitorLead = await VisitorLead.create({
      name,
      phone: phone.replace(/\D/g, ""), // Remove non-digits
      source: "Projects Page",
    });

    res.status(201).json({
      success: true,
      message: "Thank you! We'll contact you soon.",
      data: visitorLead,
    });
  } catch (error) {
    console.error("Error creating visitor lead:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit information",
      error: error.message,
    });
  }
};

// @desc    Get all visitor leads (Admin)
// @route   GET /api/visitor-leads/admin/all
// @access  Private/Admin
export const getAllVisitorLeads = async (req, res) => {
  try {
    const leads = await VisitorLead.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("Error fetching visitor leads:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch visitor leads",
      error: error.message,
    });
  }
};

// @desc    Update visitor lead status
// @route   PUT /api/visitor-leads/:id/status
// @access  Private/Admin
export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await VisitorLead.findByIdAndUpdate(
      req.params.id,
      { status, isRead: true },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error("Error updating lead status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update lead status",
      error: error.message,
    });
  }
};

// @desc    Delete visitor lead
// @route   DELETE /api/visitor-leads/:id
// @access  Private/Admin
export const deleteVisitorLead = async (req, res) => {
  try {
    const lead = await VisitorLead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};
