import Contact from "../models/Contact.js";

// @desc    Create a new contact submission
// @route   POST /api/contacts
// @access  Public
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contactData = {
      name,
      email,
      phone,
      subject,
      message,
    };

    // Add userId if user is authenticated
    if (req.user) {
      contactData.userId = req.user._id;
    }

    const contact = await Contact.create(contactData);

    res.status(201).json({
      success: true,
      message: "Contact submission received successfully",
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact submissions (Admin only)
// @route   GET /api/contacts
// @access  Private/Admin
export const getAllContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const contacts = await Contact.find(filter)
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      contacts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single contact submission by ID (Admin only)
// @route   GET /api/contacts/:id
// @access  Private/Admin
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id).populate(
      "userId",
      "fullName email"
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact submission status (Admin only)
// @route   PUT /api/contacts/:id
// @access  Private/Admin
export const updateContact = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    if (status) contact.status = status;
    if (notes !== undefined) contact.notes = notes;

    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact submission updated successfully",
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a contact submission (Admin only)
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact submission not found",
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: "Contact submission deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my contact submissions (User)
// @route   GET /api/contacts/my-submissions
// @access  Private
export const getMyContactSubmissions = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    next(error);
  }
};
