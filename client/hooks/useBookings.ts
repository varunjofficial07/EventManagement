import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Booking {
  id: string;
  user_id: string;
  event_id: string;
  quantity: number;
  total_price: number;
  status: string;
  booking_reference: string;
  created_at: string;
  event?: {
    title: string;
    date: string;
    start_time: string;
    location: string;
    image_url: string;
  };
}

export function useUserBookings(userId: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;
    fetchUserBookings();
  }, [userId]);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          `
          *,
          event:event_id(title, date, start_time, location, image_url)
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setBookings(data as Booking[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, error, refetch: fetchUserBookings };
}

export function useEventBookings(eventId: string) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!eventId) return;
    fetchEventBookings();
  }, [eventId]);

  const fetchEventBookings = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          `
          *,
          user:user_id(full_name, email, phone)
        `
        )
        .eq("event_id", eventId)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setBookings(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching event bookings:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, error, refetch: fetchEventBookings };
}

export async function createBooking(
  userId: string,
  eventId: string,
  quantity: number,
  totalPrice: number
) {
  try {
    const bookingRef = `EVT-${Date.now()}`;

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: userId,
          event_id: eventId,
          quantity,
          total_price: totalPrice,
          booking_reference: bookingRef,
          status: "confirmed",
        },
      ])
      .select();

    if (error) throw error;

    // Generate tickets
    if (data?.[0]) {
      await generateTickets(data[0].id, eventId, userId, quantity);
    }

    return { success: true, data: data?.[0] };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error };
  }
}

async function generateTickets(
  bookingId: string,
  eventId: string,
  userId: string,
  quantity: number
) {
  try {
    const tickets = Array.from({ length: quantity }).map((_, i) => ({
      booking_id: bookingId,
      event_id: eventId,
      user_id: userId,
      ticket_number: `TICKET-${Date.now()}-${i + 1}`,
      status: "active",
    }));

    const { error } = await supabase.from("tickets").insert(tickets);

    if (error) throw error;
  } catch (error) {
    console.error("Error generating tickets:", error);
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", bookingId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return { success: false, error };
  }
}
