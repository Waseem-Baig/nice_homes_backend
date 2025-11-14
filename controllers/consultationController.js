import Consultation from "../models/Consultation.js";

// @desc    Create new consultation booking
// @route   POST /api/consultations
// @access  Public
export const createConsultation = async (req, res, next) => {
  try {
    const { name, email, phone, propertyType, budget, location } = req.body;

    // Check if user is authenticated and add userId
    const consultationData = {
      name,
      email,
      phone,
      propertyType,
      budget,
      location,
    };

    if (req.user) {
      consultationData.userId = req.user.id;
    }

    const consultation = await Consultation.create(consultationData);

    res.status(201).json({
      success: true,
      message: "Consultation booking submitted successfully",
      consultation: {
        id: consultation._id,
        name: consultation.name,
        email: consultation.email,
        phone: consultation.phone,
        propertyType: consultation.propertyType,
        budget: consultation.budget,
        location: consultation.location,
        status: consultation.status,
        createdAt: consultation.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all consultations (Admin only)
// @route   GET /api/consultations
// @access  Private/Admin
export const getAllConsultations = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const consultations = await Consultation.find(query)
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Consultation.countDocuments(query);

    res.status(200).json({
      success: true,
      count: consultations.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      consultations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get consultation by ID
// @route   GET /api/consultations/:id
// @access  Private/Admin
export const getConsultationById = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id).populate(
      "userId",
      "fullName email"
    );

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    res.status(200).json({
      success: true,
      consultation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update consultation status/notes
// @route   PUT /api/consultations/:id
// @access  Private/Admin
export const updateConsultation = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    if (status) consultation.status = status;
    if (notes !== undefined) consultation.notes = notes;

    await consultation.save();

    res.status(200).json({
      success: true,
      message: "Consultation updated successfully",
      consultation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete consultation
// @route   DELETE /api/consultations/:id
// @access  Private/Admin
export const deleteConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
      });
    }

    await consultation.deleteOne();

    res.status(200).json({
      success: true,
      message: "Consultation deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's consultations
// @route   GET /api/consultations/my-consultations
// @access  Private
export const getMyConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find({ userId: req.user.id }).sort(
      { createdAt: -1 }
    );

    res.status(200).json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    next(error);
  }
};
