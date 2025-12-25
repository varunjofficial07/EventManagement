import { supabase } from "../config/supabaseClient.js";

export const EventModel = {
  async getPublic(filters) {
    try {
      let query = supabase.from("events").select("*");

      // Category filter: only support category_id (UUID)
      if (filters?.categoryId) {
        const catId = String(filters.categoryId).trim();
        query = query.eq("category_id", catId);
      }

      if (filters?.search) query = query.ilike("title", `%${filters.search}%`);
      if (filters?.priceMin !== undefined) query = query.gte("price", filters.priceMin);
      if (filters?.priceMax !== undefined) query = query.lte("price", filters.priceMax);

      return await query.order("date", { ascending: true });
    } catch (err) {
      return { data: null, error: err };
    }
  },

  getById(id) {
    return supabase.from("events").select("*").eq("id", id).single();
  },

  getByOrganizer(organizerId) {
    return supabase
      .from("events")
      .select("*")
      .eq("organizer_id", organizerId)
      .order("created_at", { ascending: false });
  },

  create(event) {
    return supabase.from("events").insert(event).select().single();
  },

  update(id, organizerId, updates) {
    return supabase
      .from("events")
      .update(updates)
      .eq("id", id)
      .eq("organizer_id", organizerId);
  },

  delete(id, organizerId) {
    return supabase
      .from("events")
      .delete()
      .eq("id", id)
      .eq("organizer_id", organizerId);
  },
};
