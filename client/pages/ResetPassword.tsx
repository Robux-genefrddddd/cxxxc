import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { Cloud, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email) {
        setError("Please enter your email");
        setLoading(false);
        return;
      }

      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(
        err.message.includes("user-not-found")
          ? "Email not found"
          : "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
            <Cloud className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">CloudVault</h1>
          <p className="text-muted-foreground mt-2">Reset your password</p>
        </div>

        {/* Reset Form */}
        <div className="card-base p-6 shadow-sm">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="p-3 bg-green-50 text-green-700 rounded-lg dark:bg-green-900/20 dark:text-green-400">
                <p className="text-sm font-medium">Email sent!</p>
                <p className="text-sm mt-1">
                  Check your email for a link to reset your password.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
