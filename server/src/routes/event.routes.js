import express from "express";
import { EventController } from "../controllers/event.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* 🔥 SPECIFIC ROUTES FIRST */
router.get("/mine", requireAuth, EventController.myEvents);

/* CATEGORIES */
router.get("/categories", EventController.getCategories);

/* PUBLIC ROUTES */
router.get("/", EventController.getPublic);
router.get("/:id", EventController.getOne);

/* ORGANIZER ACTIONS */
router.post("/", requireAuth, EventController.create);
router.put("/:id", requireAuth, EventController.update);
router.delete("/:id", requireAuth, EventController.remove);

export default router;
