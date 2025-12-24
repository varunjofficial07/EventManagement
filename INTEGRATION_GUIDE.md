# Frontend-Backend Integration Guide

## 📋 Integration Checklist

### Step 1: Setup Environment Variables ✅
- [x] Created `.env.local` file
- [ ] Get your Supabase credentials from:
  - **Supabase Dashboard** → **Settings** → **API**
  - Copy: **Project URL** → `VITE_SUPABASE_URL`
  - Copy: **Anon Key** → `VITE_SUPABASE_ANON_KEY`
- [ ] Update `.env.local` with your credentials

### Step 2: Install Dependencies ✅
```bash
npm install @supabase/supabase-js
```

### Step 3: Created Files ✅
- [x] `client/lib/supabase.ts` - Supabase client
- [x] `client/hooks/useAuth.ts` - Authentication hook
- [x] `client/hooks/useEvents.ts` - Events operations
- [x] `client/hooks/useBookings.ts` - Bookings operations
- [x] `client/hooks/useTickets.ts` - Tickets operations
- [x] `client/context/AuthContext.tsx` - Auth context provider
- [x] Updated `client/App.tsx` with AuthProvider

---

## 🔧 Integration Steps for Each Page

### 1. **Register Page** → Integrate Sign-up

**Current Status**: Mock form validation

**To Integrate**:
```typescript
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { signUp } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await signUp(
      formData.email,
      formData.password,
      formData.fullName,
      role
    );
    
    if (result.success) {
      navigate("/login", { state: { message: "Check your email to confirm signup" } });
    } else {
      setError("Sign-up failed: " + result.error?.message);
    }
    
    setIsLoading(false);
  };
}
```

---

### 2. **Login Page** → Integrate Authentication

**Current Status**: Mock login form

**To Integrate**:
```typescript
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { login, user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirect based on user role
      if (user?.role === "organizer") {
        navigate("/organizer");
      } else if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      setError("Login failed: " + result.error?.message);
    }
    
    setIsLoading(false);
  };
}
```

---

### 3. **Home Page** → Display Events from Database

**Current Status**: Mock events array

**To Integrate**:
```typescript
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";

export default function Home() {
  const { events, loading, error } = useEvents();

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events</div>;

  return (
    <Layout>
      {/* Hero section stays the same */}
      
      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </Layout>
  );
}
```

---

### 4. **Browse Events Page** → Add Search & Filtering

**Current Status**: Mock data with local filtering

**To Integrate**:
```typescript
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/EventCard";

export default function BrowseEvents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [priceRange, setPriceRange] = useState([0, 500]);

  const filters = {
    category: selectedCategory === "all" ? undefined : selectedCategory,
    priceMin: priceRange[0],
    priceMax: priceRange[1],
    searchQuery: searchQuery || undefined,
  };

  const { events, loading, error } = useEvents(filters);

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      {/* Search and filters UI */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </Layout>
  );
}
```

---

### 5. **Event Details Page** → Load Event from Database

**Current Status**: Mock event details

**To Integrate**:
```typescript
import { useParams } from "react-router-dom";
import { useEventDetail } from "@/hooks/useEvents";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { event, loading, error } = useEventDetail(id!);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;
  if (!event) return <NotFound />;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event details from database */}
          <div className="lg:col-span-2">
            <h1>{event.title}</h1>
            <p>{event.description}</p>
            {/* ... other event details ... */}
          </div>

          {/* Booking card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-20">
              <p className="text-4xl font-bold">${event.price}</p>
              {/* Availability from database */}
              <p>{event.available_seats} of {event.total_capacity} seats</p>
              <Button onClick={handleBooking}>Book Now</Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

---

### 6. **Booking Page** → Create Booking in Database

**Current Status**: Mock booking form

**To Integrate**:
```typescript
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { createBooking } from "@/hooks/useBookings";

export default function Booking() {
  const { eventId } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const totalPrice = quantity * event.price;

    const result = await createBooking(
      user.id,
      eventId!,
      quantity,
      totalPrice
    );

    if (result.success) {
      // Show confirmation page
      setBookingStep("confirmation");
    } else {
      alert("Booking failed");
    }

    setIsLoading(false);
  };
}
```

---

### 7. **User Dashboard** → Show User's Bookings & Tickets

**Current Status**: Mock bookings array

**To Integrate**:
```typescript
import { useAuthContext } from "@/context/AuthContext";
import { useUserBookings } from "@/hooks/useBookings";
import { useUserTickets } from "@/hooks/useTickets";

export default function UserDashboard() {
  const { user } = useAuthContext();
  const { bookings, loading: bookingsLoading } = useUserBookings(user?.id);
  const { tickets, loading: ticketsLoading } = useUserTickets(user?.id);

  if (bookingsLoading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </Layout>
  );
}
```

---

### 8. **Organizer Dashboard** → Manage Events & View Stats

**Current Status**: Mock event list

**To Integrate**:
```typescript
import { useAuthContext } from "@/context/AuthContext";
import { useOrganizerEvents, createEvent, updateEvent, deleteEvent } from "@/hooks/useEvents";
import { useEventBookings } from "@/hooks/useBookings";

export default function OrganizerDash() {
  const { user } = useAuthContext();
  const { events, loading, refetch } = useOrganizerEvents(user?.id);
  const { bookings } = useEventBookings(selectedEventId);

  const handleCreateEvent = async (eventData) => {
    const result = await createEvent({
      ...eventData,
      organizer_id: user.id,
    });

    if (result.success) {
      refetch();
      alert("Event created successfully!");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const result = await deleteEvent(eventId);
    if (result.success) {
      refetch();
    }
  };

  return (
    <Layout>
      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Total Events" value={events.length} />
        {/* ... other stats ... */}
      </div>

      {/* Events table */}
      <table>
        {events.map((event) => (
          <tr key={event.id}>
            <td>{event.title}</td>
            <td>{event.date}</td>
            {/* ... other columns ... */}
            <td>
              <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </table>
    </Layout>
  );
}
```

---

### 9. **Admin Panel** → Manage Users & Events

**Current Status**: Mock user/event lists

**To Integrate** (you'll need to create admin hooks):
```typescript
// client/hooks/useAdmin.ts
export function useAllUsers() {
  // Fetch all users from users table
}

export function usePendingEvents() {
  // Fetch events with status = 'pending'
}

export async function approveEvent(eventId: string) {
  // Update event status to 'approved'
}

export async function blockUser(userId: string) {
  // Update user status to 'blocked'
}
```

---

## 🔄 Data Flow

```
Frontend Pages
    ↓
Custom Hooks (useAuth, useEvents, etc.)
    ↓
Supabase Client (client/lib/supabase.ts)
    ↓
Supabase Database
    ↓
Supabase REST API
    ↓
PostgreSQL Tables
```

---

## 📝 Example: Complete Home Page Integration

```typescript
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";
import { Search, Sparkles } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { events, loading, error } = useEvents(
    searchQuery ? { searchQuery } : undefined
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-accent-50 overflow-hidden pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            Discover & Book Amazing Events
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find and book tickets to the best events happening near you.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>

        {loading && <div>Loading events...</div>}
        {error && <div>Error loading events</div>}

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found</p>
          </div>
        )}
      </section>
    </Layout>
  );
}
```

---

## ✅ Next Steps

1. **Update `.env.local`** with your Supabase credentials
2. **Update Login Page** to use `useAuthContext`
3. **Update Register Page** to create users in database
4. **Update Home Page** to fetch events from database
5. **Update Browse Events** to use real search/filters
6. **Update Event Details** to load from database
7. **Update Booking Page** to create bookings
8. **Update User Dashboard** to show real bookings
9. **Update Organizer Dashboard** to manage real events
10. **Create Admin hooks** and update Admin Panel

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- [ ] Check `.env.local` exists
- [ ] Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set
- [ ] Restart dev server after updating `.env.local`

### "Network error from Supabase"
- [ ] Check internet connection
- [ ] Verify Supabase project is active
- [ ] Check CORS settings in Supabase dashboard

### "Authentication not working"
- [ ] Verify user exists in users table
- [ ] Check password is correct
- [ ] Ensure Supabase Auth is enabled

### "Bookings not creating"
- [ ] Verify event exists in events table
- [ ] Check user is authenticated
- [ ] Review RLS (Row Level Security) policies

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase React Guide](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
