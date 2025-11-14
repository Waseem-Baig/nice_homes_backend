import Partner from "../models/Partner.js";

// @desc    Create a new partner submission
// @route   POST /api/partners
// @access  Public
export const createPartner = async (req, res, next) => {
  try {
    const { name, company, email, phone, expertise, message } = req.body;

    const partnerData = {
      name,
      company,
      email,
      phone,
      expertise,
      message,
    };

    // Add userId if user is authenticated
    if (req.user) {
      partnerData.userId = req.user._id;
    }

    const partner = await Partner.create(partnerData);

    res.status(201).json({
      success: true,
      message: "Partner submission received successfully",
      partner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all partner submissions (Admin only)
// @route   GET /api/partners
// @access  Private/Admin
export const getAllPartners = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const partners = await Partner.find(filter)
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Partner.countDocuments(filter);

    res.status(200).json({
      success: true,
      partners,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single partner submission by ID (Admin only)
// @route   GET /api/partners/:id
// @access  Private/Admin
export const getPartnerById = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id).populate(
      "userId",
      "fullName email"
    );

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner submission not found",
      });
    }

    res.status(200).json({
      success: true,
      partner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update partner submission status (Admin only)
// @route   PUT /api/partners/:id
// @access  Private/Admin
export const updatePartner = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner submission not found",
      });
    }

    if (status) partner.status = status;
    if (notes !== undefined) partner.notes = notes;

    await partner.save();

    res.status(200).json({
      success: true,
      message: "Partner submission updated successfully",
      partner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a partner submission (Admin only)
// @route   DELETE /api/partners/:id
// @access  Private/Admin
export const deletePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner submission not found",
      });
    }

    await partner.deleteOne();

    res.status(200).json({
      success: true,
      message: "Partner submission deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my partner submissions (User)
// @route   GET /api/partners/my-submissions
// @access  Private
export const getMyPartnerSubmissions = async (req, res, next) => {
  try {
    const partners = await Partner.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      partners,
    });
  } catch (error) {
    next(error);
  }
};
