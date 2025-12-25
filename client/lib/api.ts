// Use relative path for dev server (8080), absolute for production
const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? '/api'  // Use /api for both dev (8080) and production since Express is mounted as middleware
  : '/api';

/* =========================
   HELPERS
========================= */

const json = async (res: Response) => {
  if (res.status === 204) {
    return null;
  }

  const text = await res.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response from server");
  }
};

/* =========================
   API METHODS
========================= */

export const api = {
  /* ---------- PUBLIC EVENTS ---------- */

  getPublicEvents: async (filters?: {
    categoryId?: string;
    priceMin?: number;
    priceMax?: number;
    searchQuery?: string;
  }) => {
    const params = new URLSearchParams();

    if (filters?.categoryId) {
      params.append("category_id", filters.categoryId);
    }

    if (filters?.priceMin !== undefined) {
      params.append("priceMin", String(filters.priceMin));
    }

    if (filters?.priceMax !== undefined) {
      params.append("priceMax", String(filters.priceMax));
    }

    if (filters?.searchQuery) {
      params.append("search", filters.searchQuery);
    }

    return fetch(`${API_BASE}/events?${params.toString()}`).then(json);
  },

  getCategories: async () => {
    return fetch(`${API_BASE}/events/categories`).then(json);
  },

  getEventById: async (eventId: string) => {
    return fetch(`${API_BASE}/events/${eventId}`).then(json);
  },

  /* ---------- ORGANIZER EVENTS ---------- */

  getMyEvents: async (token: string) => {
    return fetch(`${API_BASE}/events/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(json);
  },

  createEvent: async (token: string, data: any) => {
    return fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(json);
  },

  updateEvent: async (token: string, eventId: string, data: any) => {
    return fetch(`${API_BASE}/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(json);
  },

  deleteEvent: async (token: string, eventId: string) => {
    return fetch(`${API_BASE}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(json);
  },

  /* ---------- BOOKINGS ---------- */

  getMyBookings: async (token: string) => {
    return fetch(`${API_BASE}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(json);
  },

  createBooking: async (token: string, data: {
    event_id: string;
    quantity: number;
  }) => {
    return fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(json);
  },

  getBookingById: async (bookingId: string, token: string) => {
    return fetch(`${API_BASE}/bookings/${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(json);
  },

  /* ---------- TICKETS ---------- */

  getMyTickets: async (token: string) => {
    return fetch(`${API_BASE}/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(json);
  },

  getTicketById: async (ticketId: string, token: string) => {
    return fetch(`${API_BASE}/tickets/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(json);
  },

  downloadTicket: async (ticketId: string, token: string) => {
    return fetch(`${API_BASE}/tickets/${ticketId}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};