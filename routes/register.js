import express from "express";
import {
  registerUser,
  registerView,
} from "../controllers/registerController.js";

const router = express.Router();

router.get("/", registerView);
router.post("/", registerUser);

export default router;
