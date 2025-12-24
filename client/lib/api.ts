const API_BASE = "http://localhost:5000/api";

/* =========================
   HELPERS
========================= */

const json = async (res: Response) => {
  if (res.status === 204) {
    return null; // No content
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
    category?: string;
    priceMin?: number;
    priceMax?: number;
    searchQuery?: string;
  }) => {
    const params = new URLSearchParams();

    if (filters?.category) {
      params.append("category", filters.category);
    }

    if (filters?.priceMin !== undefined) {
      params.append("priceMin", String(filters.priceMin));
    }

    if (filters?.priceMax !== undefined) {
      params.append("priceMax", String(filters.priceMax));
    }

    if (filters?.searchQuery) {
      params.append("search", filters.searchQuery); // ✅ backend-aligned
    }

    return fetch(`${API_BASE}/events?${params.toString()}`).then(json);
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
};
