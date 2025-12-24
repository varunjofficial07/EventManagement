import { useState } from "react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { Trash2, Lock, Unlock, Eye, AlertCircle } from "lucide-react";

const ADMIN_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    joinDate: "2024-01-15",
    bookings: 3,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "organizer",
    status: "active",
    joinDate: "2024-01-10",
    events: 2,
  },
  {
    id: 3,
    name: "Suspicious User",
    email: "suspicious@example.com",
    role: "user",
    status: "flagged",
    joinDate: "2024-03-01",
    bookings: 0,
  },
];

const ADMIN_EVENTS = [
  {
    id: 1,
    title: "Tech Conference 2024",
    organizer: "Jane Smith",
    date: "2024-03-15",
    status: "approved",
    attendees: 455,
  },
  {
    id: 2,
    title: "Suspicious Event",
    organizer: "Unknown",
    date: "2024-03-20",
    status: "pending",
    attendees: 0,
  },
  {
    id: 3,
    title: "Web Design Workshop",
    organizer: "Jane Smith",
    date: "2024-03-18",
    status: "approved",
    attendees: 22,
  },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"users" | "events">("users");
  const [users, setUsers] = useState(ADMIN_USERS);
  const [events, setEvents] = useState(ADMIN_EVENTS);

  const handleBlockUser = (id: number) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u
      )
    );
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleApproveEvent = (id: number) => {
    setEvents(
      events.map((e) =>
        e.id === id ? { ...e, status: "approved" } : e
      )
    );
  };

  const handleRejectEvent = (id: number) => {
    if (confirm("Are you sure you want to reject this event?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  return (
    <Layout>
      {/* Admin Only Warning */}
      <div className="bg-red-50 border-b-2 border-red-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 font-medium">
            Admin Panel - Restricted Access. All actions are logged.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-lg opacity-90">Manage users, events, and platform activity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "users"
                ? "border-red-600 text-red-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Users Management
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "events"
                ? "border-red-600 text-red-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Events Moderation
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Total Users</p>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Active Users</p>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Flagged Accounts</p>
                <p className="text-3xl font-bold text-red-600">
                  {users.filter((u) => u.status === "flagged").length}
                </p>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="px-6 py-4 text-left font-semibold">Name</th>
                      <th className="px-6 py-4 text-left font-semibold">Email</th>
                      <th className="px-6 py-4 text-center font-semibold">Role</th>
                      <th className="px-6 py-4 text-center font-semibold">Status</th>
                      <th className="px-6 py-4 text-left font-semibold">Join Date</th>
                      <th className="px-6 py-4 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-muted transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold">{user.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : user.status === "flagged"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {user.joinDate}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Eye className="w-5 h-5 text-primary-600" />
                            </button>
                            <button
                              onClick={() => handleBlockUser(user.id)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              {user.status === "active" ? (
                                <Lock className="w-5 h-5 text-orange-600" />
                              ) : (
                                <Unlock className="w-5 h-5 text-green-600" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Total Events</p>
                <p className="text-3xl font-bold">{events.length}</p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {events.filter((e) => e.status === "approved").length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {events.filter((e) => e.status === "pending").length}
                </p>
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="px-6 py-4 text-left font-semibold">Event Title</th>
                      <th className="px-6 py-4 text-left font-semibold">Organizer</th>
                      <th className="px-6 py-4 text-left font-semibold">Date</th>
                      <th className="px-6 py-4 text-center font-semibold">Status</th>
                      <th className="px-6 py-4 text-center font-semibold">
                        Attendees
                      </th>
                      <th className="px-6 py-4 text-center font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-border hover:bg-muted transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold">{event.title}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {event.organizer}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {event.date}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                              event.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold">
                          {event.attendees}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {event.status === "pending" && (
                              <>
                                <Button
                                  onClick={() => handleApproveEvent(event.id)}
                                  size="sm"
                                  className="text-xs"
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleRejectEvent(event.id)}
                                  variant="danger"
                                  size="sm"
                                  className="text-xs"
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {event.status === "approved" && (
                              <Button
                                onClick={() => handleRejectEvent(event.id)}
                                variant="danger"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
