import PropertyView from "../models/PropertyView.js";

// @desc    Track property view
// @route   POST /api/property-views
// @access  Public
export const trackPropertyView = async (req, res) => {
  try {
    const {
      projectId,
      projectName,
      visitorName,
      visitorPhone,
      visitorEmail,
      deviceInfo,
      viewDuration,
    } = req.body;

    if (!projectId || !projectName) {
      return res.status(400).json({
        success: false,
        message: "Project ID and name are required",
      });
    }

    // Get visitor's IP address
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const propertyView = await PropertyView.create({
      projectId,
      projectName,
      visitorName,
      visitorPhone: visitorPhone ? visitorPhone.replace(/\D/g, "") : undefined,
      visitorEmail,
      deviceInfo,
      ipAddress,
      viewDuration,
    });

    res.status(201).json({
      success: true,
      message: "View tracked successfully",
      data: propertyView,
    });
  } catch (error) {
    console.error("Error tracking property view:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track view",
      error: error.message,
    });
  }
};

// @desc    Get all property views (Admin)
// @route   GET /api/property-views/admin/all
// @access  Private/Admin
export const getAllPropertyViews = async (req, res) => {
  try {
    const views = await PropertyView.find()
      .populate("projectId", "name type location price image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: views.length,
      views,
    });
  } catch (error) {
    console.error("Error fetching property views:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch property views",
      error: error.message,
    });
  }
};

// @desc    Get property views by project
// @route   GET /api/property-views/project/:projectId
// @access  Private/Admin
export const getViewsByProject = async (req, res) => {
  try {
    const views = await PropertyView.find({
      projectId: req.params.projectId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: views.length,
      views,
    });
  } catch (error) {
    console.error("Error fetching project views:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project views",
      error: error.message,
    });
  }
};

// @desc    Update property view status
// @route   PUT /api/property-views/:id/status
// @access  Private/Admin
export const updateViewStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const updateData = { isRead: true };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const view = await PropertyView.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("projectId", "name type location price image");

    if (!view) {
      return res.status(404).json({
        success: false,
        message: "View not found",
      });
    }

    res.status(200).json({
      success: true,
      view,
    });
  } catch (error) {
    console.error("Error updating view status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update view status",
      error: error.message,
    });
  }
};

// @desc    Delete property view
// @route   DELETE /api/property-views/:id
// @access  Private/Admin
export const deletePropertyView = async (req, res) => {
  try {
    const view = await PropertyView.findByIdAndDelete(req.params.id);

    if (!view) {
      return res.status(404).json({
        success: false,
        message: "View not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "View deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting view:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete view",
      error: error.message,
    });
  }
};

// @desc    Get view statistics
// @route   GET /api/property-views/admin/stats
// @access  Private/Admin
export const getViewStats = async (req, res) => {
  try {
    const totalViews = await PropertyView.countDocuments();
    const viewsWithContact = await PropertyView.countDocuments({
      $or: [
        { visitorPhone: { $exists: true, $ne: null } },
        { visitorEmail: { $exists: true, $ne: null } },
      ],
    });
    const newViews = await PropertyView.countDocuments({ status: "New" });

    // Get top viewed projects
    const topProjects = await PropertyView.aggregate([
      {
        $group: {
          _id: "$projectId",
          projectName: { $first: "$projectName" },
          viewCount: { $sum: 1 },
        },
      },
      { $sort: { viewCount: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalViews,
        viewsWithContact,
        newViews,
        topProjects,
      },
    });
  } catch (error) {
    console.error("Error fetching view stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message,
    });
  }
};
