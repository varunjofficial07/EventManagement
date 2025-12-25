import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "./useAuth";

/* =========================
   TYPES
========================= */

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  price: number;
  image_url: string;
  available_seats: number;
  total_capacity: number;
  category: string;
  organizer_id: string;
  status: string;
  created_at: string;
}

export interface EventWithOrganizer extends Event {
  organizer?: {
    full_name: string;
    company_name: string;
    profile_image_url: string;
  };
}

/* =========================
   PUBLIC EVENTS (HOME / BROWSE)
========================= */

export function useEvents(filters?: {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  searchQuery?: string;
}) {
  const [events, setEvents] = useState<EventWithOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      

      const data = await api.getPublicEvents({
        categoryId: filters?.categoryId,
        priceMin: filters?.priceMin,
        priceMax: filters?.priceMax,
        searchQuery: filters?.searchQuery,
      });

      setEvents(data ?? []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters?.category,
    filters?.priceMin,
    filters?.priceMax,
    filters?.searchQuery,
  ]);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
}

/* =========================
   SINGLE EVENT (DETAIL PAGE)
========================= */

export function useEventDetail(eventId: string) {
  const [event, setEvent] = useState<EventWithOrganizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!eventId) return;
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);

      const data = await api.getEventById(eventId);
      setEvent(data);
      setError(null);
      console.log("Fetched events:", data);
    } catch (err) {
      console.error("Error fetching event:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { event, loading, error };
}

/* =========================
   ORGANIZER EVENTS (DASHBOARD)
========================= */

export function useOrganizerEvents() {
  const { session } = useAuth();
  const token = session?.access_token;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    fetchOrganizerEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchOrganizerEvents = async () => {
    try {
      setLoading(true);

      const data = await api.getMyEvents(token);
      setEvents(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching organizer events:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { events, loading, error, refetch: fetchOrganizerEvents };
}

/* =========================
   CRUD OPERATIONS (ORGANIZER)
========================= */

export async function createEvent(token: string, event: Partial<Event>) {
  try {
    const data = await api.createEvent(token, event);
    return { success: true, data };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error };
  }
}

export async function updateEvent(
  token: string,
  eventId: string,
  updates: Partial<Event>
) {
  try {
    await api.updateEvent(token, eventId, updates);
    return { success: true };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error };
  }
}

export async function deleteEvent(token: string, eventId: string) {
  try {
    await api.deleteEvent(token, eventId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error };
  }
}
