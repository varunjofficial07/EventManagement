import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Ticket {
  id: string;
  booking_id: string;
  event_id: string;
  user_id: string;
  ticket_number: string;
  qr_code: string;
  status: string;
  created_at: string;
  event?: {
    title: string;
    date: string;
    start_time: string;
    location: string;
  };
}

export function useUserTickets(userId: string) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;
    fetchUserTickets();
  }, [userId]);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("tickets")
        .select(
          `
          *,
          event:event_id(title, date, start_time, location)
        `
        )
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setTickets(data as Ticket[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { tickets, loading, error, refetch: fetchUserTickets };
}

export async function getTicketDetail(ticketId: string) {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .select(
        `
        *,
        event:event_id(title, date, start_time, location)
      `
      )
      .eq("id", ticketId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return { success: false, error };
  }
}
