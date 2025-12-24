import { supabase } from "../config/supabaseClient.js";

export const EventModel = {
  getPublic(filters) {
    let query = supabase
      .from("events")
      .select("*")
      // .in("status", ["approved", "active"])
      // .order("date", { ascending: true });

    if (filters?.category) query.eq("category", filters.category);
    if (filters?.q) query.ilike("title", `%${filters.q}%`);
    if (filters?.priceMin) query.gte("price", filters.priceMin);
    if (filters?.priceMax) query.lte("price", filters.priceMax);

    return query;
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
  async getPublic({ category, search, priceMin, priceMax }) {
    let query = supabase
      .from("events")
      .select("*")
      // .eq("status", "approved")
      // .gt("available_seats", 0);

    if (category) query = query.eq("category", category);
    if (search)
      query = query.ilike("title", `%${search}%`);

    if (priceMin) query = query.gte("price", priceMin);
    if (priceMax) query = query.lte("price", priceMax);

    const { data, error } = await query.order("date", { ascending: true });
    if (error) throw error;

    return data;
  },
};
