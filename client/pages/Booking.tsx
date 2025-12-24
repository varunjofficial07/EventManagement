import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { ArrowLeft, Check, Mail, Users } from "lucide-react";

// Mock event data
const EVENTS: Record<string, any> = {
  "1": {
    id: "1",
    title: "Tech Conference 2024",
    date: "March 15, 2024",
    location: "San Francisco Convention Center, CA",
    price: 299,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
  },
};

export default function Booking() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const event = EVENTS[eventId!] || EVENTS["1"];
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingStep, setBookingStep] = useState<"form" | "confirmation">("form");
  const [isLoading, setIsLoading] = useState(false);

  const totalPrice = event.price * quantity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to the terms";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    // Move to confirmation
    setBookingStep("confirmation");
  };

  if (bookingStep === "confirmation") {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-accent-50 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-green-200">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 rounded-full p-4 animate-bounce">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Your event booking has been successfully confirmed.
              </p>

              {/* Confirmation Details */}
              <div className="bg-green-50 rounded-lg p-6 mb-8 text-left space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">Event</p>
                    <p className="font-semibold text-lg">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                </div>

                <div className="border-t border-green-200 pt-4">
                  <div className="flex justify-between mb-3">
                    <span className="text-muted-foreground">Tickets:</span>
                    <span className="font-semibold">{quantity}x @ ${event.price}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <div className="border-t border-green-200 pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary-600" />
                    <span className="text-sm">
                      Confirmation sent to <strong>{formData.email}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-600" />
                    <span className="text-sm">
                      Booked for <strong>{formData.fullName}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Ticket Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
                <p className="text-sm text-blue-700">
                  <strong>📧 Check your email</strong> for your event ticket and
                  booking details. Your ticket will be available in your
                  dashboard.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Home
                </Button>
                <Button
                  size="lg"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1"
                >
                  View Tickets
                </Button>
              </div>

              {/* Reference Number */}
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Booking Reference</p>
                <p className="font-mono font-bold text-sm">
                  EVT-{Date.now().toString().slice(-6)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-4xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-lg text-muted-foreground">
            Fill in your details to secure your tickets
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quantity Selector */}
              <div className="bg-white rounded-xl p-6 border border-border">
                <h2 className="text-xl font-bold mb-4">Select Quantity</h2>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors font-bold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center px-3 py-2 border border-border rounded-lg focus:border-primary-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors font-bold"
                  >
                    +
                  </button>
                  <span className="text-muted-foreground ml-auto">
                    {quantity} ticket{quantity !== 1 ? "s" : ""} selected
                  </span>
                </div>
              </div>

              {/* Attendee Information */}
              <div className="bg-white rounded-xl p-6 border border-border space-y-4">
                <h2 className="text-xl font-bold">Attendee Information</h2>

                <FormInput
                  label="Full Name"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                />

                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  helperText="Tickets will be sent to this email"
                />

                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
              </div>

              {/* Terms & Conditions */}
              <div className="bg-white rounded-xl p-6 border border-border">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-border accent-primary-600 mt-1"
                  />
                  <div>
                    <p className="font-medium">
                      I agree to the terms and conditions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By booking, you agree to our event policies and terms of
                      service.
                    </p>
                  </div>
                </label>
                {errors.agreedToTerms && (
                  <p className="text-red-500 text-sm mt-2">{errors.agreedToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                Confirm Booking
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-20 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>

              {/* Event Summary */}
              <div className="border-b border-border pb-4">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 rounded-lg object-cover mb-3"
                />
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                <p className="text-sm text-muted-foreground">{event.location}</p>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {quantity} ticket{quantity !== 1 ? "s" : ""} × ${event.price}
                  </span>
                  <span className="font-semibold">${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking fee</span>
                  <span className="font-semibold">Free</span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">${totalPrice}</span>
                </div>
              </div>

              {/* Info */}
              <div className="bg-primary-50 rounded-lg p-3 text-sm text-primary-700">
                ✓ No hidden charges. Secure booking.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
