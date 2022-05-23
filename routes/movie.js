import express from "express";
import { movieView } from "../controllers/movieController.js";

const router = express.Router();

router.get("/:id", movieView);

export default router;
