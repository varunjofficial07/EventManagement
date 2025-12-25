import { BookingService } from "../services/booking.service.js";

export const BookingController = {
  async getMyBookings(req, res) {
    try {
      const bookings = await BookingService.getUserBookings(req.user.id);
      res.json(bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      res.status(500).json({ message: err.message || "Failed to fetch bookings" });
    }
  },

  async createBooking(req, res) {
    try {
      const { event_id, quantity } = req.body;
      
      if (!event_id || !quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid booking data" });
      }

      const booking = await BookingService.createBooking(req.user.id, {
        event_id,
        quantity,
      });
      
      res.status(201).json(booking);
    } catch (err) {
      console.error("Error creating booking:", err);
      res.status(400).json({ message: err.message || "Failed to create booking" });
    }
  },

  async getBookingById(req, res) {
    try {
      const booking = await BookingService.getBooking(req.params.id, req.user.id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (err) {
      console.error("Error fetching booking:", err);
      res.status(500).json({ message: err.message });
    }
  },
};