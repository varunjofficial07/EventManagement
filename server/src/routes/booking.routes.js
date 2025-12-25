import express from "express";
import { BookingController } from "../controllers/booking.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, BookingController.getMyBookings);
router.post("/", requireAuth, BookingController.createBooking);
router.get("/:id", requireAuth, BookingController.getBookingById);

export default router;