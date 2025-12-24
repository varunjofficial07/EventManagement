import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { Search, Calendar, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

const FEATURED_EVENTS = [
  {
    id: "1",
    title: "Tech Conference 2024",
    date: "March 15, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "San Francisco Convention Center, CA",
    availableSeats: 45,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    price: 299,
  },
  {
    id: "2",
    title: "Music Festival Night",
    date: "March 22, 2024",
    time: "6:00 PM - 11:00 PM",
    location: "Central Park Amphitheater, New York",
    availableSeats: 12,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&h=300&fit=crop",
    price: 89,
  },
  {
    id: "3",
    title: "Web Design Workshop",
    date: "March 18, 2024",
    time: "2:00 PM - 6:00 PM",
    location: "Creative Hub Downtown, Los Angeles",
    availableSeats: 28,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    price: 149,
  },
];

export default function UserHome() {
  const { user } = useAuthContext();

  return (
    <Layout>
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Welcome back, {user?.full_name || user?.name || "User"}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover and book amazing events happening near you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/dashboard"
            className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">My Bookings</p>
                <p className="text-3xl font-bold text-foreground">3</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Upcoming Events</p>
                <p className="text-3xl font-bold text-foreground">2</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent-600" />
              </div>
            </div>
          </Link>

          <Link
            to="/browse"
            className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Browse Events</p>
                <p className="text-3xl font-bold text-foreground">24</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/browse"
              className="flex items-center gap-4 p-6 bg-white rounded-xl border border-border hover:border-primary-600 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                <Search className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Browse Events</h3>
                <p className="text-sm text-muted-foreground">Discover new events to attend</p>
              </div>
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-4 p-6 bg-white rounded-xl border border-border hover:border-primary-600 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">My Bookings</h3>
                <p className="text-sm text-muted-foreground">View and manage your tickets</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Featured Events */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Events</h2>
            <Link
              to="/browse"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_EVENTS.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

