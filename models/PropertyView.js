import mongoose from "mongoose";

const propertyViewSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    visitorName: {
      type: String,
      trim: true,
    },
    visitorPhone: {
      type: String,
      trim: true,
    },
    visitorEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    deviceInfo: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    viewDuration: {
      type: Number, // in seconds
      default: 0,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Not Interested"],
      default: "New",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
propertyViewSchema.index({ projectId: 1, createdAt: -1 });
propertyViewSchema.index({ visitorPhone: 1 });

const PropertyView = mongoose.model("PropertyView", propertyViewSchema);

export default PropertyView;
