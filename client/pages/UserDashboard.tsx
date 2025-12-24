import { useState } from "react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { Calendar, MapPin, Download, Trash2, Clock, Ticket } from "lucide-react";

const USER_BOOKINGS = [
  {
    id: 1,
    eventTitle: "Tech Conference 2024",
    date: "March 15, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "San Francisco Convention Center, CA",
    tickets: 2,
    price: 598,
    status: "confirmed",
    ticketId: "TICKET-2024-001",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150&fit=crop",
  },
  {
    id: 2,
    eventTitle: "Music Festival Night",
    date: "March 22, 2024",
    time: "6:00 PM - 11:00 PM",
    location: "Central Park Amphitheater, New York",
    tickets: 1,
    price: 89,
    status: "confirmed",
    ticketId: "TICKET-2024-002",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=150&fit=crop",
  },
  {
    id: 3,
    eventTitle: "Web Design Workshop",
    date: "March 18, 2024",
    time: "2:00 PM - 6:00 PM",
    location: "Creative Hub Downtown, Los Angeles",
    tickets: 1,
    price: 149,
    status: "pending",
    ticketId: "TICKET-2024-003",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150&fit=crop",
  },
];

const USER_PROFILE = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  joinDate: "January 15, 2024",
  totalBookings: 3,
  totalSpent: 836,
};

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<"bookings" | "profile">("bookings");
  const [bookings, setBookings] = useState(USER_BOOKINGS);

  const handleCancel = (id: number) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      setBookings(bookings.filter((b) => b.id !== id));
    }
  };

  const handleDownloadTicket = (ticketId: string) => {
    // Simulate ticket download
    alert(`Downloading ticket: ${ticketId}`);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-lg opacity-90">Manage your bookings and profile</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "bookings"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Profile
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Total Bookings</p>
                <p className="text-3xl font-bold">{USER_PROFILE.totalBookings}</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Total Spent</p>
                <p className="text-3xl font-bold">${USER_PROFILE.totalSpent}</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Upcoming Events</p>
                <p className="text-3xl font-bold">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </p>
              </div>
            </div>

            {/* Bookings List */}
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
                      {/* Image */}
                      <div className="md:col-span-1">
                        <img
                          src={booking.image}
                          alt={booking.eventTitle}
                          className="w-full h-32 rounded-lg object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="md:col-span-2 space-y-2">
                        <h3 className="font-bold text-lg">{booking.eventTitle}</h3>

                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.location}</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-primary-600" />
                          <span className="text-sm">
                            {booking.tickets} ticket{booking.tickets !== 1 ? "s" : ""} •
                            <span className="font-semibold ml-1">${booking.price}</span>
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-3">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {booking.status === "confirmed"
                              ? "✓ Confirmed"
                              : "⏳ Pending"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-1 flex flex-col gap-2 justify-center">
                        <Button
                          onClick={() => handleDownloadTicket(booking.ticketId)}
                          variant="primary"
                          size="sm"
                          className="w-full"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        <Button
                          onClick={() => handleCancel(booking.id)}
                          variant="danger"
                          size="sm"
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <p className="text-lg text-muted-foreground mb-4">
                  No bookings yet
                </p>
                <Button onClick={() => (window.location.href = "/browse")}>
                  Browse Events
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <div className="max-w-2xl">
              <div className="bg-white rounded-lg p-8 border border-border space-y-6">
                <h2 className="text-2xl font-bold">Profile Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Full Name
                    </label>
                    <p className="text-lg font-semibold">{USER_PROFILE.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Email
                    </label>
                    <p className="text-lg font-semibold">{USER_PROFILE.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Phone
                    </label>
                    <p className="text-lg font-semibold">{USER_PROFILE.phone}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Member Since
                    </label>
                    <p className="text-lg font-semibold">{USER_PROFILE.joinDate}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-3">
                  <Button size="lg" className="w-full">
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    Change Password
                  </Button>
                </div>

                <div className="border-t border-border pt-6">
                  <Button variant="danger" size="lg" className="w-full">
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
