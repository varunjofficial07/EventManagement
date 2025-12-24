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
              <EventCard time={""} availableSeats={0} image={""} key={event.id} {...event} />
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