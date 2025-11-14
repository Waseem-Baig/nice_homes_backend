import Testimonial from "../models/Testimonial.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all testimonials (Public - only active)
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res, next) => {
  try {
    const { featured } = req.query;

    const filter = { isActive: true };
    if (featured === "true") {
      filter.featured = true;
    }

    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all testimonials (Admin - all)
// @route   GET /api/testimonials/admin
// @access  Private/Admin
export const getAllTestimonialsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const testimonials = await Testimonial.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Testimonial.countDocuments(filter);

    res.status(200).json({
      success: true,
      testimonials,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single testimonial by ID
// @route   GET /api/testimonials/:id
// @access  Public
export const getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
export const createTestimonial = async (req, res, next) => {
  try {
    const { name, role, company, content, rating, featured, isActive } =
      req.body;

    const testimonialData = {
      name,
      role,
      company,
      content,
      rating: rating || 5,
      featured: featured === "true" || featured === true,
      isActive: isActive === "true" || isActive === true || true,
    };

    // Add image if uploaded
    if (req.file) {
      testimonialData.image = `/uploads/${req.file.filename}`;
    }

    const testimonial = await Testimonial.create(testimonialData);

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    // Delete uploaded file if testimonial creation fails
    if (req.file) {
      fs.unlink(
        path.join(__dirname, "../uploads", req.file.filename),
        (err) => {
          if (err) console.error("Error deleting file:", err);
        }
      );
    }
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      // Delete uploaded file if testimonial not found
      if (req.file) {
        fs.unlink(
          path.join(__dirname, "../uploads", req.file.filename),
          (err) => {
            if (err) console.error("Error deleting file:", err);
          }
        );
      }
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const { name, role, company, content, rating, featured, isActive } =
      req.body;

    if (name) testimonial.name = name;
    if (role) testimonial.role = role;
    if (company !== undefined) testimonial.company = company;
    if (content) testimonial.content = content;
    if (rating) testimonial.rating = rating;
    if (featured !== undefined)
      testimonial.featured = featured === "true" || featured === true;
    if (isActive !== undefined)
      testimonial.isActive = isActive === "true" || isActive === true;

    // Update image if new one is uploaded
    if (req.file) {
      // Delete old image if exists
      if (testimonial.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          testimonial.image.replace(/^\//, "")
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old file:", err);
        });
      }
      testimonial.image = `/uploads/${req.file.filename}`;
    }

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      fs.unlink(
        path.join(__dirname, "../uploads", req.file.filename),
        (err) => {
          if (err) console.error("Error deleting file:", err);
        }
      );
    }
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Delete image file if exists
    if (testimonial.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        testimonial.image.replace(/^\//, "")
      );
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle testimonial active status
// @route   PATCH /api/testimonials/:id/toggle-active
// @access  Private/Admin
export const toggleTestimonialActive = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: `Testimonial ${
        testimonial.isActive ? "activated" : "deactivated"
      } successfully`,
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle testimonial featured status
// @route   PATCH /api/testimonials/:id/toggle-featured
// @access  Private/Admin
export const toggleTestimonialFeatured = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    testimonial.featured = !testimonial.featured;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: `Testimonial ${
        testimonial.featured ? "marked as featured" : "unmarked as featured"
      } successfully`,
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};
