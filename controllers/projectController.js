import Project from "../models/Project.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to delete image file
const deleteImageFile = (imagePath) => {
  if (imagePath) {
    const fullPath = path.join(__dirname, "..", imagePath.replace("/", ""));
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// @desc    Get all projects (Public - only active)
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const { featured, type } = req.query;

    const filter = { isActive: true };
    if (featured === "true") {
      filter.featured = true;
    }
    if (type) {
      filter.type = type;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects (Admin - all)
// @route   GET /api/projects/admin/all
// @access  Private/Admin
export const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive, type } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }
    if (type) {
      filter.type = type;
    }

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Project.countDocuments(filter);

    res.status(200).json({
      success: true,
      projects,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    const projectData = {
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    };

    // Parse amenities if it's a string
    if (typeof projectData.amenities === "string") {
      projectData.amenities = JSON.parse(projectData.amenities);
    }

    // Parse specifications if it's a string
    if (typeof projectData.specifications === "string") {
      projectData.specifications = JSON.parse(projectData.specifications);
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    // Delete uploaded file if project creation fails
    if (req.file) {
      deleteImageFile(`/uploads/${req.file.filename}`);
    }
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      // Delete uploaded file if project not found
      if (req.file) {
        deleteImageFile(`/uploads/${req.file.filename}`);
      }
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const oldImage = project.image;

    // Update project data
    const updateData = { ...req.body };

    // If new image is uploaded, update image path
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Parse amenities if it's a string
    if (typeof updateData.amenities === "string") {
      updateData.amenities = JSON.parse(updateData.amenities);
    }

    // Parse specifications if it's a string
    if (typeof updateData.specifications === "string") {
      updateData.specifications = JSON.parse(updateData.specifications);
    }

    Object.assign(project, updateData);
    await project.save();

    // Delete old image if new one was uploaded
    if (req.file && oldImage) {
      deleteImageFile(oldImage);
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      deleteImageFile(`/uploads/${req.file.filename}`);
    }
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete image file
    if (project.image) {
      deleteImageFile(project.image);
    }

    // Delete gallery images
    if (project.gallery && project.gallery.length > 0) {
      project.gallery.forEach((img) => deleteImageFile(img));
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle project active status
// @route   PATCH /api/projects/:id/toggle-active
// @access  Private/Admin
export const toggleProjectActive = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.isActive = !project.isActive;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${
        project.isActive ? "activated" : "deactivated"
      } successfully`,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle project featured status
// @route   PATCH /api/projects/:id/toggle-featured
// @access  Private/Admin
export const toggleProjectFeatured = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.featured = !project.featured;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${
        project.featured ? "marked as featured" : "unmarked as featured"
      } successfully`,
      project,
    });
  } catch (error) {
    next(error);
  }
};
