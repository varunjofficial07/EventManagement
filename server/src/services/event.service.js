import { EventModel } from "../models/event.model.js";
import { supabase } from "../config/supabaseClient.js";

/* =========================
   HELPER: CHECK ORGANIZER ROLE
========================= */

async function isOrganizer(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.role === "organizer";
}

/* =========================
   EVENT SERVICE
========================= */
export const EventService = {
  async createEvent(user, data) {
    const organizer = await isOrganizer(user.id);

    if (!organizer) {
      throw new Error("Only organizers can create events");
    }

    if (data.end_time <= data.start_time) {
      throw new Error("End time must be after start time");
    }

    return EventModel.create({
      ...data,
      organizer_id: user.id,
      available_seats: data.total_capacity,
      status: "pending",
    });
  },

  getPublicEvents(filters) {
    return (async () => {
      const { data, error } = await EventModel.getPublic(filters);
      if (error) throw error;
      return data;
    })();
  },

  async getCategories() {
    // Return canonical categories (id + name) from categories table.
    // Do NOT fall back to text-based event.category (schema removed).
    try {
      const { data: catData, error: catErr } = await supabase
        .from("categories")
        .select("id, name")
        .order("name", { ascending: true });

      if (catErr) throw catErr;
      if (!Array.isArray(catData)) return [];

      // Return array of objects { id, name }
      return catData.map((c) => ({ id: c.id, name: c.name }));
    } catch (err) {
      console.error("Error fetching categories:", err?.message || err);
      return [];
    }
  },

  async getEvent(id) {
    const { data, error } = await EventModel.getById(id);
    if (error) throw error;
    return data;
  },

  async getMyEvents(user) {
    const organizer = await isOrganizer(user.id);

    if (!organizer) {
      throw new Error("Only organizers can view their events");
    }

    const { data, error } = await EventModel.getByOrganizer(user.id);
    if (error) throw error;
    return data;
  },

  async updateEvent(user, id, updates) {
    const organizer = await isOrganizer(user.id);

    if (!organizer) {
      throw new Error("Only organizers can update events");
    }

    const { data, error } = await EventModel.update(id, user.id, updates);
    if (error) throw error;
    return data;
  },

  async deleteEvent(user, id) {
    const organizer = await isOrganizer(user.id);

    if (!organizer) {
      throw new Error("Only organizers can delete events");
    }

    const { data, error } = await EventModel.delete(id, user.id);
    if (error) throw error;
    return data;
  },
  
};
