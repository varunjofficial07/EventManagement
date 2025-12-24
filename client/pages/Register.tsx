import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { User, Briefcase, ArrowRight } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuthContext();
  const [role, setRole] = useState<"user" | "organizer">("user");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    ...(role === "organizer" && { companyName: "", description: "" }),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) {
      setSubmitError("");
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
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (role === "organizer") {
      if (!formData.companyName?.trim()) {
        newErrors.companyName = "Company name is required";
      }
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
    setSubmitError("");

    try {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        role
      );

      if (result.success) {
        // Check if email confirmation is required
        const requiresConfirmation = result.data?.user && !result.data?.session;
        
        if (requiresConfirmation) {
          navigate("/login", {
            state: { 
              message: "Registration successful! Please check your email (including spam folder) and click the confirmation link before logging in."
            },
          });
        } else {
          // If no confirmation needed, redirect directly to appropriate dashboard
          // Wait a moment for user profile to be fetched
          await new Promise(resolve => setTimeout(resolve, 500));
          const userRole = role;
          if (userRole === "admin") {
            navigate("/admin/panel", { replace: true });
          } else if (userRole === "organizer") {
            navigate("/organizer/dashboard", { replace: true });
          } else {
            navigate("/user/home", { replace: true });
          }
        }
      } else {
        setSubmitError(result.error?.message || "Registration failed. Please try again.");
      }
    } catch (error: any) {
      setSubmitError(error?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Join EventHub to discover amazing events
            </p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setRole("user")}
              className={`p-4 rounded-xl border-2 transition-all ${
                role === "user"
                  ? "border-primary-600 bg-primary-50"
                  : "border-border bg-white hover:border-primary-300"
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2 text-primary-600" />
              <p className="font-semibold text-sm">User</p>
              <p className="text-xs text-muted-foreground">Book events</p>
            </button>

            <button
              onClick={() => setRole("organizer")}
              className={`p-4 rounded-xl border-2 transition-all ${
                role === "organizer"
                  ? "border-primary-600 bg-primary-50"
                  : "border-border bg-white hover:border-primary-300"
              }`}
            >
              <Briefcase className="w-6 h-6 mx-auto mb-2 text-primary-600" />
              <p className="font-semibold text-sm">Organizer</p>
              <p className="text-xs text-muted-foreground">Create events</p>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-6 shadow-sm border border-border">
            <FormInput
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="your.email@gmail.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              helperText="Use a real email address (Gmail, Yahoo, Outlook, etc.)"
            />

            {role === "organizer" && (
              <FormInput
                label="Company Name"
                name="companyName"
                placeholder="Your Company"
                value={formData.companyName || ""}
                onChange={handleChange}
                error={errors.companyName}
              />
            )}

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText="At least 6 characters"
            />

            <FormInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            {submitError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="w-full mt-6"
            >
              Create {role === "organizer" ? "Organizer" : "User"} Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 font-semibold hover:underline"
            >
              Log in here
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
