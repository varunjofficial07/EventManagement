import { supabase } from "../config/supabaseClient.js";

export const TicketService = {
  async getUserTickets(userId) {
    const { data, error } = await supabase
      .from("tickets")
      .select(`
        *,
        event:event_id(id, title, date, start_time, location)
      `)
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getTicket(ticketId, userId) {
    const { data, error } = await supabase
      .from("tickets")
      .select(`
        *,
        event:event_id(id, title, date, start_time, location),
        booking:booking_id(id, booking_reference)
      `)
      .eq("id", ticketId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async createTickets(bookingId, eventId, userId, quantity) {
    const tickets = [];

    for (let i = 0; i < quantity; i++) {
      const ticketNumber = `TKT-${Date.now()}-${i + 1}`;
      const qrCode = `${bookingId}-${i + 1}`; // Simplified QR code

      tickets.push({
        booking_id: bookingId,
        event_id: eventId,
        user_id: userId,
        ticket_number: ticketNumber,
        qr_code: qrCode,
        status: "active",
      });
    }

    const { data, error } = await supabase
      .from("tickets")
      .insert(tickets)
      .select();

    if (error) throw error;
    return data;
  },
};