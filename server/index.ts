import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./src/routes/demo";
import eventRoutes from "./src/routes/event.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js";
import ticketRoutes from "./src/routes/ticket.routes.js";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "pong";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Main API routes
  app.use("/api/events", eventRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/tickets", ticketRoutes);

  // Error handling middleware
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Server error:", err);
    res.status(500).json({ message: "Internal server error" });
  });

  return app;
}