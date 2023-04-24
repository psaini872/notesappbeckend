import express from "express";
import {
  postNote,
  getNotes,
  deleteNote,
} from "../controller/notesController.js";
import { protect } from "../controller/userController.js";

const router = express.Router();

router.route("/postnote").post(protect, postNote);
router.route("/getnotes").get(protect, getNotes);
router.route("/deletenote/:id").delete(protect, deleteNote);

export default router;
