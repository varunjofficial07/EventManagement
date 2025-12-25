import { useState } from "react";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import {
  useOrganizerEvents,
  createEvent,
  deleteEvent,
} from "@/hooks/useEvents";
import {
  BarChart3,
  Edit2,
  Trash2,
  Plus,
  Eye,
  Users,
  TrendingUp,
} from "lucide-react";


export default function OrganizerDash() {
  const { session } = useAuth();
  const token = session?.access_token;

  const { events, loading, refetch } = useOrganizerEvents();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    total_capacity: "",
    price: "",
    category: "tech",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const handleEditEvent = (event: any) => {
  setEditingEventId(event.id);

  setFormData({
    title: event.title,
    description: event.description,
    date: event.date,
    start_time: event.start_time,
    end_time: event.end_time,
    location: event.location,
    total_capacity: String(event.total_capacity),
    price: String(event.price),
    category: event.category,
  });

  setShowCreateModal(true);
};

  /* =========================
     CREATE EVENT (BACKEND)
  ========================= */
  const handleCreateEvent = async () => {
    if (!token) return;

    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.location ||
      !formData.total_capacity ||
      !formData.price
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (formData.end_time <= formData.start_time) {
      alert("End time must be after start time");
      return;
    }

    setSubmitting(true);

    // If an image was selected, upload to Supabase Storage and get public URL
    let imageUrl: string | undefined = undefined;
    if (imageFile) {
      try {
        setUploadingImage(true);
        const { supabase } = await import("@/lib/supabase");
        const filePath = `events/${Date.now()}_${imageFile.name}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("events")
          .upload(filePath, imageFile, { cacheControl: "3600", upsert: false });

        if (uploadErr) {
          console.error("Supabase upload error:", uploadErr);
          alert("Image upload failed");
        } else {
          const { data: urlData } = await supabase.storage.from("events").getPublicUrl(filePath);
          imageUrl = urlData.publicUrl;
        }
      } catch (e) {
        console.error("Image upload exception:", e);
        alert("Image upload failed");
      } finally {
        setUploadingImage(false);
      }
    }

    const res = await createEvent(token, {
      ...formData,
      total_capacity: Number(formData.total_capacity),
      price: Number(formData.price),
      ...(imageUrl ? { image_url: imageUrl } : {}),
    });

    setSubmitting(false);

    if (!res.success) {
      alert("Failed to create event");
      return;
    }

    setShowCreateModal(false);
    setFormData({
      title: "",
      description: "",
      date: "",
      start_time: "",
      end_time: "",
      location: "",
      total_capacity: "",
      price: "",
      category: "tech",
    });
    setImageFile(null);

    refetch();
  };
  

  /* =========================
     DELETE EVENT (BACKEND)
  ========================= */
  const handleDeleteEvent = async (eventId: string) => {
    if (!token) return;

    const confirm = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirm) return;

    const res = await deleteEvent(token, eventId);

    if (!res.success) {
      alert("Failed to delete event");
      return;
    }

    refetch();
  };

  /* =========================
     STATS
  ========================= */
  const totalCapacity = events.reduce(
    (sum, e) => sum + e.total_capacity,
    0
  );
  const totalAttendees = events.reduce(
    (sum, e) => sum + (e.total_capacity - e.available_seats),
    0
  );
  const totalRevenue = events.reduce(
    (sum, e) =>
      sum + (e.total_capacity - e.available_seats) * Number(e.price),
    0
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary text-white py-12 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Organizer Dashboard
            </h1>
            <p className="text-lg opacity-90">
              Manage your events and bookings
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-5 h-5" />
            Create Event
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Stat title="Total Events" value={events.length} icon={<BarChart3 />} />
          <Stat title="Total Attendees" value={totalAttendees} icon={<Users />} />
          <Stat
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            icon={<TrendingUp />}
          />
          <Stat
            title="Occupancy"
            value={
              totalCapacity
                ? `${Math.round(
                    (totalAttendees / totalCapacity) * 100
                  )}%`
                : "0%"
            }
            icon={<BarChart3 />}
          />
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg border">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left">Event</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-center">Capacity</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-6 py-4 font-semibold">{e.title}</td>
                  <td className="px-6 py-4">{e.date}</td>
                  <td className="px-6 py-4 text-center">
                    {e.total_capacity}
                  </td>
                  <td className="px-6 py-4 text-center capitalize">
                    {e.status}
                  </td>
                  <td className="px-6 py-4 text-center flex gap-3 justify-center">
                    <Eye className="w-5 h-5 text-primary cursor-pointer" />
                    <Edit2
                        className="w-5 h-5 text-secondary cursor-pointer"
                        onClick={() => handleEditEvent(e)}
                      />
                    <Trash2
                      className="w-5 h-5 text-red-500 cursor-pointer"
                      onClick={() => handleDeleteEvent(e.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Create Event</h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <input
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      start_time: e.target.value,
                    })
                  }
                />
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      end_time: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  value={formData.total_capacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total_capacity: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
                {/* Image upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Event Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files && e.target.files[0];
                      if (!f) return;
                      if (!f.type.startsWith("image/")) {
                        alert("Please select an image file");
                        return;
                      }
                      if (f.size > 5 * 1024 * 1024) {
                        alert("Image must be 5MB or smaller");
                        return;
                      }
                      setImageFile(f);
                    }}
                  />
                  {imageFile && (
                    <p className="text-sm text-muted-foreground mt-2">Selected: {imageFile.name}</p>
                  )}
                </div>
                <textarea
                  className="col-span-2"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent} disabled={submitting}>
                  {submitting
                      ? "Saving..."
                      : editingEventId
                      ? "Update Event"
                      : "Create Event"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

/* =========================
   STAT COMPONENT
========================= */
function Stat({ title, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-lg border flex justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="opacity-40">{icon}</div>
    </div>
  );
}
