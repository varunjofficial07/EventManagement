import express from "express";
import { TicketController } from "../controllers/ticket.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, TicketController.getMyTickets);
router.get("/:id", requireAuth, TicketController.getTicketById);
router.get("/:id/download", requireAuth, TicketController.downloadTicket);

export default router;