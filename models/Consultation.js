import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
      trim: true,
    },
    propertyType: {
      type: String,
      required: [true, "Please select a property type"],
      enum: ["villa", "apartment", "farmhouse", "plot"],
    },
    budget: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "completed", "cancelled"],
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow anonymous submissions
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model("Consultation", consultationSchema);

export default Consultation;
