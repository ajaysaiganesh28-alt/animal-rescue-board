const RescueRequest = require("../models/RescueRequest");

// @desc  Create a new rescue request
// @route POST /api/requests
const createRequest = async (req, res) => {
  try {
    const { animalType, description, reporterName, contactNumber, address, lat, lng, urgency } =
      req.body;

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newRequest = await RescueRequest.create({
      animalType,
      description,
      reporterName,
      contactNumber,
      location: { address, lat: lat ? Number(lat) : undefined, lng: lng ? Number(lng) : undefined },
      photoUrl,
      urgency,
    });

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc  Get all rescue requests (supports ?status= filter)
// @route GET /api/requests
const getRequests = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const requests = await RescueRequest.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single rescue request
// @route GET /api/requests/:id
const getRequestById = async (req, res) => {
  try {
    const request = await RescueRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update a rescue request (edit details)
// @route PUT /api/requests/:id
const updateRequest = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.photoUrl = `/uploads/${req.file.filename}`;

    const updated = await RescueRequest.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Request not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc  Claim a rescue request (volunteer/NGO assigns themselves)
// @route PATCH /api/requests/:id/claim
const claimRequest = async (req, res) => {
  try {
    const { name, organization, contactNumber } = req.body;

    const request = await RescueRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request has already been claimed" });
    }

    request.claimedBy = { name, organization, contactNumber };
    request.status = "claimed";
    await request.save();

    res.json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc  Update status only (claimed -> in-progress -> rescued/closed)
// @route PATCH /api/requests/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "claimed", "in-progress", "rescued", "closed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const request = await RescueRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc  Delete a rescue request
// @route DELETE /api/requests/:id
const deleteRequest = async (req, res) => {
  try {
    const deleted = await RescueRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Request not found" });
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  claimRequest,
  updateStatus,
  deleteRequest,
};
