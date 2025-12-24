import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Share2,
  Heart,
  Star,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useEventDetail } from "@/hooks/useEvents";
import { formatDate, formatTime } from "@/lib/utils/eventUtils";
import { useAuthContext } from "@/context/AuthContext";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const { event, loading, error } = useEventDetail(id || "");
  const [isFavorite, setIsFavorite] = useState(false);

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/event/${id}` } } });
      return;
    }
    navigate(`/booking/${id}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: `Check out this event: ${event?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-lg text-muted-foreground">Event not found</p>
          <Button onClick={() => navigate("/browse")} className="mt-4">
            Browse Events
          </Button>
        </div>
      </Layout>
    );
  }

  const occupancyPercentage = event.total_capacity > 0
    ? (((event.total_capacity - event.available_seats) / event.total_capacity) * 100).toFixed(0)
    : "0";

  return (
    <Layout>
      {/* Hero Section with Image */}
      <div className="relative h-96 bg-gradient-to-br from-primary-200 to-accent-100 overflow-hidden">
        <img
          src={event.image_url || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white rounded-full p-3 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Floating Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button
            onClick={handleShare}
            className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors"
          >
            <Share2 className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="bg-white rounded-full p-3 hover:bg-gray-100 transition-colors"
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Basic Info */}
            <div>
              <h1 className="text-5xl font-bold mb-4">{event.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">
                {event.description || "Join us for an amazing event experience!"}
              </p>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span className="text-sm text-muted-foreground">Date</span>
                  </div>
                  <p className="font-semibold">{formatDate(event.date)}</p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <span className="text-sm text-muted-foreground">Time</span>
                  </div>
                  <p className="font-semibold">{formatTime(event.start_time, event.end_time)}</p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <span className="text-sm text-muted-foreground">Location</span>
                  </div>
                  <p className="font-semibold text-sm">{event.location}</p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-primary-600" />
                    <span className="text-sm text-muted-foreground">Seats</span>
                  </div>
                  <p className="font-semibold">{event.available_seats} left</p>
                </div>
              </div>
            </div>

            {/* Category */}
            {event.category && (
              <div>
                <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-20 space-y-6">
              {/* Price */}
              <div>
                <p className="text-muted-foreground text-sm mb-1">Price per ticket</p>
                <p className="text-4xl font-bold text-primary-600">${event.price}</p>
              </div>

              {/* Availability */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Availability</p>
                <div className="w-full bg-border rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-600 to-secondary h-3 rounded-full transition-all"
                    style={{ width: `${occupancyPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {event.available_seats} of {event.total_capacity} seats available
                </p>
              </div>

              {/* Organizer Info */}
              {event.organizer && (
                <div className="border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground mb-3">Organized by</p>
                  <div className="flex items-center gap-3">
                    {event.organizer.profile_image_url ? (
                      <img
                        src={event.organizer.profile_image_url}
                        alt={event.organizer.full_name || event.organizer.company_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {(event.organizer.full_name || event.organizer.company_name || "O")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">
                        {event.organizer.company_name || event.organizer.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground">Organizer</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <Button
                onClick={handleBooking}
                size="lg"
                className="w-full"
                disabled={event.available_seats === 0}
              >
                {event.available_seats > 0 ? "Book Now" : "Event Sold Out"}
              </Button>

              {/* Info Text */}
              <p className="text-xs text-muted-foreground text-center">
                {isAuthenticated
                  ? "Confirmation details will be sent to your email."
                  : "Please log in to book tickets."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
