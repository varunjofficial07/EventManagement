import { EventService } from "../services/event.service.js";

export const EventController = {
  async getPublic(req, res) {
    const { data, error } = await EventService.getPublicEvents(req.query);
    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  },

  async getOne(req, res) {
    const { data, error } = await EventService.getEvent(req.params.id);
    if (error) return res.status(404).json({ message: "Event not found" });
    res.json(data);
  },

  async myEvents(req, res) {
    const { data } = await EventService.getMyEvents(req.user);
    res.json(data);
  },

  async create(req, res) {
    try {
      const result = await EventService.createEvent(req.user, req.body);
      res.status(201).json(result.data);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    await EventService.updateEvent(req.user, req.params.id, req.body);
    res.json({ message: "Event updated" });
  },

  async remove(req, res) {
    await EventService.deleteEvent(req.user, req.params.id);
    res.json({ message: "Event deleted" });
  },
async getPublicEvents(req, res) {
    try {
      const filters = {
        category: req.query.category,
        search: req.query.search,
        priceMin: req.query.priceMin,
        priceMax: req.query.priceMax,
      };

      const events = await EventService.getPublicEvents(filters);

      // ✅ ALWAYS return JSON (even if empty)
      return res.status(200).json(events || []);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: err.message || "Failed to fetch events",
      });
    }
  },
};
