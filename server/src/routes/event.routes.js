import express from "express";
import { EventController } from "../controllers/event.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* 🔥 SPECIFIC ROUTES FIRST */
router.get("/mine", requireAuth, EventController.myEvents);

/* PUBLIC ROUTES */
router.get("/", EventController.getPublic);
router.get("/", EventController.getPublicEvents);
// router.get("/", authOptional, EventController.getPublicEvents);
router.get("/:id", EventController.getOne);

/* ORGANIZER ACTIONS */
router.post("/", requireAuth, EventController.create);
router.put("/:id", requireAuth, EventController.update);
router.delete("/:id", requireAuth, EventController.remove);

export default router;
