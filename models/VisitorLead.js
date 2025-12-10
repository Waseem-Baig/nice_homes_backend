import mongoose from "mongoose";

const visitorLeadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      default: "Projects Page",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Not Interested"],
      default: "New",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const VisitorLead = mongoose.model("VisitorLead", visitorLeadSchema);

export default VisitorLead;
