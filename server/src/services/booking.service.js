import { supabase } from "../config/supabaseClient.js";

export const BookingService = {
  async getUserBookings(userId) {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        event:event_id(id, title, date, start_time, location, image_url)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getBooking(bookingId, userId) {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        event:event_id(id, title, date, start_time, location, image_url)
      `)
      .eq("id", bookingId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // 'PGRST116' = no rows returned
    return data;
  },

  async createBooking(userId, { event_id, quantity }) {
    // Get event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("price, available_seats")
      .eq("id", event_id)
      .single();

    if (eventError || !event) {
      throw new Error("Event not found");
    }

    if (event.available_seats < quantity) {
      throw new Error("Not enough seats available");
    }

    // Calculate total price
    const total_price = event.price * quantity;

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([{
        user_id: userId,
        event_id,
        quantity,
        total_price,
        status: "pending",
        booking_reference: `BK-${Date.now()}`,
      }])
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Update available seats
    await supabase
      .from("events")
      .update({ available_seats: event.available_seats - quantity })
      .eq("id", event_id);

    return booking;
  },
};