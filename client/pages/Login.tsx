import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import { ArrowRight } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resendConfirmationEmail, isAuthenticated, user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showResendEmail, setShowResendEmail] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated && user) {
      const userRole = user.role;
      if (userRole === "admin") {
        navigate("/admin/panel", { replace: true });
      } else if (userRole === "organizer") {
        navigate("/organizer/dashboard", { replace: true });
      } else if (userRole === "user") {
        navigate("/user/home", { replace: true });
      }
      return;
    }

    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [isAuthenticated, user, navigate, location.state]);

  // Watch for user changes after login
  useEffect(() => {
    if (isAuthenticated && user && !submitError && !isLoading) {
      const userRole = user.role;
      const from = location.state?.from?.pathname;
      
      if (from && from !== "/login" && from !== "/register") {
        navigate(from, { replace: true });
      } else {
        if (userRole === "admin") {
          navigate("/admin/panel", { replace: true });
        } else if (userRole === "organizer") {
          navigate("/organizer/dashboard", { replace: true });
        } else if (userRole === "user") {
          navigate("/user/home", { replace: true });
        }
      }
    }
  }, [isAuthenticated, user, navigate, location.state, submitError, isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // The useEffect hook will handle the redirect once user profile is loaded
        // Just clear any errors and wait
        setSubmitError("");
      } else {
        const errorMessage = result.error?.message || "Login failed. Please check your credentials.";
        setSubmitError(errorMessage);
        
        // Show resend email option if email not confirmed
        if (result.error?.code === "email_not_confirmed" || errorMessage.includes("confirm")) {
          setShowResendEmail(true);
        } else {
          setShowResendEmail(false);
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred. Please try again.";
      setSubmitError(errorMessage);
      
      if (error?.code === "email_not_confirmed" || errorMessage.includes("confirm")) {
        setShowResendEmail(true);
      } else {
        setShowResendEmail(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!formData.email) {
      setSubmitError("Please enter your email address first.");
      return;
    }

    setIsResendingEmail(true);
    setSubmitError("");

    try {
      const result = await resendConfirmationEmail(formData.email);
      if (result.success) {
        setSuccessMessage("Confirmation email sent! Please check your inbox (including spam folder).");
        setShowResendEmail(false);
      } else {
        setSubmitError(result.error?.message || "Failed to resend confirmation email. Please try again.");
      }
    } catch (error: any) {
      setSubmitError(error?.message || "Failed to resend confirmation email. Please try again.");
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Log in to your EventHub account
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-6 shadow-sm border border-border">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-border accent-primary-600"
                />
                <span className="text-sm text-foreground">Remember me</span>
              </label>
              <Link
                to="#"
                className="text-sm text-primary-600 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {submitError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 mb-2">{submitError}</p>
                {showResendEmail && (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={isResendingEmail}
                    className="text-sm text-primary-600 hover:text-primary-700 underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResendingEmail ? "Sending..." : "Resend confirmation email"}
                  </button>
                )}
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              size="lg"
              className="w-full mt-6"
            >
              Log In
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 font-semibold hover:underline"
            >
              Sign up here
            </Link>
          </p>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <p className="text-sm font-semibold text-primary-700 mb-2">
              🔓 Demo Credentials
            </p>
            <p className="text-xs text-primary-600 mb-1">
              <strong>Email:</strong> demo@example.com
            </p>
            <p className="text-xs text-primary-600">
              <strong>Password:</strong> demo123456
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
