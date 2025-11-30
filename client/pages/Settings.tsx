import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/lib/authContext";
import { AlertCircle, CheckCircle, Copy } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { userData, changePassword, regenerateShareToken, deleteAccount } =
    useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [shareToken, setShareToken] = useState(userData?.shareToken || "");
  const [tokenCopied, setTokenCopied] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    setPasswordLoading(true);

    try {
      if (!newPassword || !confirmPassword) {
        setPasswordError("Please fill in all fields");
        setPasswordLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError("Password must be at least 6 characters");
        setPasswordLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError("Passwords do not match");
        setPasswordLoading(false);
        return;
      }

      await changePassword(newPassword);
      setPasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRegenerateToken = async () => {
    setTokenLoading(true);
    try {
      const newToken = await regenerateShareToken();
      setShareToken(newToken);
    } catch (err) {
      console.error("Failed to regenerate token:", err);
    } finally {
      setTokenLoading(false);
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(shareToken);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);

    try {
      await deleteAccount();
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete account:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Account Settings
        </h2>

        {/* Change Password Section */}
        <div className="card-base p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Change Password
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                disabled={passwordLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                disabled={passwordLoading}
              />
            </div>

            {passwordError && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-start gap-2 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {passwordSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={passwordLoading}
              className="btn-primary"
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Share Token Section */}
        <div className="card-base p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Share Token
          </h3>

          <p className="text-sm text-muted-foreground mb-4">
            Your unique token for creating shared links. Keep this private.
          </p>

          <div className="bg-secondary/50 rounded-lg p-4 mb-4 flex items-center justify-between">
            <code className="text-sm font-mono text-foreground truncate flex-1">
              {shareToken}
            </code>
            <button
              onClick={handleCopyToken}
              disabled={tokenLoading}
              className="ml-2 p-2 hover:bg-secondary rounded transition-colors"
            >
              {tokenCopied ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          <button
            onClick={handleRegenerateToken}
            disabled={tokenLoading}
            className="btn-secondary"
          >
            {tokenLoading ? "Regenerating..." : "Regenerate Token"}
          </button>
        </div>

        {/* Delete Account Section */}
        <div className="card-base p-6 border-destructive/20 bg-destructive/5">
          <h3 className="text-lg font-semibold text-destructive mb-4">
            Danger Zone
          </h3>

          <p className="text-sm text-muted-foreground mb-6">
            Once you delete your account, there is no going back. All your files
            will be permanently deleted.
          </p>

          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="btn-destructive"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-medium text-destructive">
                Are you absolutely sure? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="btn-destructive"
                >
                  {deleteLoading ? "Deleting..." : "Yes, delete my account"}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
