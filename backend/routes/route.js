import express from "express";
import {
  getReleases,
  getReleaseById,
  createRelease,
  updateReleaseInfo,
  deleteRelease,
  toggleStep,
} from "../controllers/releasesController.js";

const router = express.Router();

// Route declarations
router.get("/", getReleases);
router.get("/:id", getReleaseById);
router.post("/", createRelease);
router.put("/:id", updateReleaseInfo);
router.delete("/:id", deleteRelease);
router.put("/:id/steps/:stepIndex", toggleStep);

export default router;