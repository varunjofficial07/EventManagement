import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { Search, Filter, X, Loader2, AlertCircle } from "lucide-react";
import { useEvents, Event } from "@/hooks/useEvents";

// Helper to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Helper to format time
const formatTime = (startTime: string, endTime?: string) => {
  const start = new Date(`2000-01-01T${startTime}`);
  const startFormatted = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (endTime) {
    const end = new Date(`2000-01-01T${endTime}`);
    const endFormatted = end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${startFormatted} - ${endFormatted}`;
  }

  return startFormatted;
};

// Transform database event to EventCard format
const transformEventForCard = (event: Event) => ({
  id: event.id,
  title: event.title,
  date: formatDate(event.date),
  time: formatTime(event.start_time, event.end_time),
  location: event.location,
  availableSeats: event.available_seats,
  image: event.image_url || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
  price: event.price,
});

type Category = "all" | "tech" | "music" | "workshop" | "business";

export default function BrowseEvents() {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Use the useEvents hook with filters
  const { events, loading, error } = useEvents({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    priceMin: priceRange[0],
    priceMax: priceRange[1],
    searchQuery: searchQuery || undefined,
  });

  // Update search query when URL param changes
  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  // Filter events by price range (client-side since useEvents doesn't support it fully)
  const filteredEvents = events.filter((event) => {
    return event.price >= priceRange[0] && event.price <= priceRange[1];
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([0, 500]);
    setCurrentPage(1);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Browse Events</h1>
          <p className="text-lg text-muted-foreground">
            {loading ? "Loading events..." : `Found ${filteredEvents.length} event${filteredEvents.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search & Filter Section */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="mb-6 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events, locations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-border focus:border-primary-600 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-border rounded-lg hover:bg-muted transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-white rounded-xl p-6 border-2 border-border mb-6 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {["all", "tech", "music", "workshop", "business"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat as Category);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === cat
                          ? "bg-primary-600 text-white"
                          : "bg-muted hover:bg-muted/70"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], parseInt(e.target.value)]);
                      setCurrentPage(1);
                    }}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={handleClearFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted hover:bg-muted/70 rounded-lg font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-lg text-muted-foreground">Failed to load events</p>
            <p className="text-sm text-muted-foreground mt-2">{error.message || "Please try again later"}</p>
          </div>
        ) : paginatedEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedEvents.map((event) => (
                <div key={event.id} className="animate-fade-up">
                  <EventCard {...transformEventForCard(event)} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border-2 border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-primary-600 text-white"
                        : "border-2 border-border hover:bg-muted"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border-2 border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No events found matching your filters.</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
