const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  claimRequest,
  updateStatus,
  deleteRequest,
} = require("../controllers/rescueController");

router.post("/", upload.single("photo"), createRequest);
router.get("/", getRequests);
router.get("/:id", getRequestById);
router.put("/:id", upload.single("photo"), updateRequest);
router.patch("/:id/claim", claimRequest);
router.patch("/:id/status", updateStatus);
router.delete("/:id", deleteRequest);

module.exports = router;
