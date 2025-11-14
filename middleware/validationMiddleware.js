import { body, validationResult } from "express-validator";

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// Register validation rules
export const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
];

// Login validation rules
export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// Update profile validation rules
export const updateProfileValidation = [
  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
];

// Change password validation rules
export const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
];

// Consultation validation rules
export const consultationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("propertyType")
    .notEmpty()
    .withMessage("Property type is required")
    .isIn(["villa", "apartment", "farmhouse", "plot"])
    .withMessage("Invalid property type"),
  body("budget").optional().trim(),
  body("location").optional().trim(),
  validate,
];

// Partner validation rules
export const partnerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2 })
    .withMessage("Company name must be at least 2 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("expertise")
    .notEmpty()
    .withMessage("Area of expertise is required")
    .isIn([
      "agent",
      "architect",
      "designer",
      "supplier",
      "contractor",
      "investor",
      "other",
    ])
    .withMessage("Invalid expertise type"),
  body("message").optional().trim(),
  validate,
];

// Contact validation rules
export const contactValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("subject").optional().trim(),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters"),
  validate,
];

// Testimonial validation rules
export const testimonialValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isLength({ min: 2 })
    .withMessage("Role must be at least 2 characters"),
  body("company").optional().trim(),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Testimonial content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  validate,
];

// Project validation rules
export const projectValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("type")
    .notEmpty()
    .withMessage("Project type is required")
    .isIn([
      "Luxury Villas",
      "Premium Apartments",
      "Luxury Farmhouse",
      "Penthouse",
      "Row House",
      "Other",
    ])
    .withMessage("Invalid project type"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("price").trim().notEmpty().withMessage("Price is required"),
  body("status")
    .optional()
    .isIn(["Upcoming", "Ongoing", "Completed", "Ready to Move"])
    .withMessage("Invalid status"),
  validate,
];

// Project Enquiry validation rules
export const projectEnquiryValidation = [
  body("projectId")
    .trim()
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Invalid project ID"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Please provide a valid phone number (10-15 digits)"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters"),
  validate,
];
