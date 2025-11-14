import ProjectEnquiry from "../models/ProjectEnquiry.js";
import Project from "../models/Project.js";

// Create a new project enquiry (Public)
export const createProjectEnquiry = async (req, res) => {
  try {
    const { projectId, name, email, phone, message } = req.body;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const enquiry = new ProjectEnquiry({
      projectId,
      projectName: project.name,
      name,
      email,
      phone,
      message,
    });

    await enquiry.save();

    res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error("Error creating project enquiry:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all project enquiries (Admin only)
export const getAllProjectEnquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const status = req.query.status;
    const isRead = req.query.isRead;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (isRead !== undefined) filter.isRead = isRead === "true";

    const enquiries = await ProjectEnquiry.find(filter)
      .populate("projectId", "name type location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProjectEnquiry.countDocuments(filter);

    res.status(200).json({
      enquiries,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching project enquiries:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single project enquiry by ID (Admin only)
export const getProjectEnquiryById = async (req, res) => {
  try {
    const enquiry = await ProjectEnquiry.findById(req.params.id).populate(
      "projectId",
      "name type location price"
    );

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({ enquiry });
  } catch (error) {
    console.error("Error fetching project enquiry:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update project enquiry status (Admin only)
export const updateProjectEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const enquiry = await ProjectEnquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({
      message: "Enquiry status updated successfully",
      enquiry,
    });
  } catch (error) {
    console.error("Error updating project enquiry status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle read status (Admin only)
export const toggleEnquiryRead = async (req, res) => {
  try {
    const enquiry = await ProjectEnquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    enquiry.isRead = !enquiry.isRead;
    await enquiry.save();

    res.status(200).json({
      message: "Read status updated successfully",
      enquiry,
    });
  } catch (error) {
    console.error("Error toggling read status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete project enquiry (Admin only)
export const deleteProjectEnquiry = async (req, res) => {
  try {
    const enquiry = await ProjectEnquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting project enquiry:", error);
    res.status(500).json({ message: "Server error" });
  }
};
