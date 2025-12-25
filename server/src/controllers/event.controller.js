import { EventService } from "../services/event.service.js";

export const EventController = {
  async getPublic(req, res) {
    try {
      const filters = {
        categoryId: req.query.category_id,
        search: req.query.search,
        priceMin: req.query.priceMin ? parseInt(req.query.priceMin) : undefined,
        priceMax: req.query.priceMax ? parseInt(req.query.priceMax) : undefined,
      };

      const events = await EventService.getPublicEvents(filters);
      res.status(200).json(events || []);
    } catch (err) {
      console.error("Error fetching public events:", err);
      res.status(500).json({
        message: err.message || "Failed to fetch events",
      });
    }
  },

  async getOne(req, res) {
    try {
      const event = await EventService.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (err) {
      res.status(404).json({ message: "Event not found" });
    }
  },

  async getCategories(req, res) {
    try {
      const categories = await EventService.getCategories();
      res.status(200).json(categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      res.status(500).json({ message: err.message || "Failed to fetch categories" });
    }
  },

  async myEvents(req, res) {
    try {
      const events = await EventService.getMyEvents(req.user);
      res.json(events || []);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const result = await EventService.createEvent(req.user, req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const result = await EventService.updateEvent(req.user, req.params.id, req.body);
      res.json({ message: "Event updated", data: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async remove(req, res) {
    try {
      await EventService.deleteEvent(req.user, req.params.id);
      res.json({ message: "Event deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
