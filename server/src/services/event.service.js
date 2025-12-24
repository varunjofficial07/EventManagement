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
    return EventModel.getPublic(filters);
  },

  getEvent(id) {
    return EventModel.getById(id);
  },

  async getMyEvents(user) {
    const organizer = await isOrganizer(user.id);

    if (!organizer) {
      throw new Error("Only organizers can view their events");
    }

    return EventModel.getByOrganizer(user.id);
  },

  async updateEvent(user, id, updates) {
    const organizer = await isOrganizer(user.id);

    if (!organizer) {
      throw new Error("Only organizers can update events");
    }

    return EventModel.update(id, user.id, updates);
  },

  async deleteEvent(user, id) {
    const organizer = await isOrganizer(user.id);

    if (!organizer) {
      throw new Error("Only organizers can delete events");
    }

    return EventModel.delete(id, user.id);
  },
  async getPublicEvents(filters) {
    return EventModel.getPublic(filters);
  },
  
};
