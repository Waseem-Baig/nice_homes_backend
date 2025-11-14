import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add project name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    location: {
      type: String,
      required: [true, "Please add location"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Please add project type"],
      enum: [
        "Luxury Villas",
        "Premium Apartments",
        "Luxury Farmhouse",
        "Penthouse",
        "Row House",
        "Other",
      ],
    },
    description: {
      type: String,
      required: [true, "Please add description"],
      minlength: [10, "Description must be at least 10 characters"],
    },
    price: {
      type: String,
      required: [true, "Please add price"],
    },
    image: {
      type: String,
      default: null,
    },
    gallery: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    specifications: {
      bedrooms: String,
      bathrooms: String,
      area: String,
      parking: String,
    },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Ready to Move"],
      default: "Upcoming",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
