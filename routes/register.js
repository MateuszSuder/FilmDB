import express from "express";
import { registerView } from "../controllers/registerController.js";

const router = express.Router();

router.get("/", registerView);

export default router;
