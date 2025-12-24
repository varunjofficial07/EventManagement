import express from "express";
import cors from "cors";
import eventRoutes from "./routes/event.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);

export default app;
