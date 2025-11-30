import { useParams } from "react-router-dom";
import { Cloud, Download, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { downloadFile, formatFileSize, formatDate } from "@/lib/fileUtils";

interface SharedFileData {
  userId: string;
  fileId: string;
  name: string;
  size: number;
  uploadedAt: string;
  storagePath: string;
}

export default function SharedFile() {
  const { token } = useParams<{ token: string }>();
  const [file, setFile] = useState<SharedFileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchSharedFile = async () => {
      if (!token) {
        setError("Invalid share link");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Since we can't query across all users directly, we would need a backend
        // endpoint for this. For now, this is a placeholder.
        // In production, you would call: GET /api/files/share/resolve?token=TOKEN
        setError("Share link functionality requires backend implementation");
      } catch (err) {
        setError("Failed to load shared file");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedFile();
  }, [token]);

  const handleDownload = async () => {
    if (!file) return;
    setDownloading(true);

    try {
      await downloadFile(file.userId, file.storagePath, file.name);
    } catch (err) {
      setError("Failed to download file");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Cloud className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">CloudVault</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Shared File</h2>
          <p className="text-muted-foreground mt-2">
            Download the file shared with you
          </p>
        </div>

        {error && (
          <div className="card-base p-6 border border-destructive/20 bg-destructive/5 text-center">
            <div className="flex items-start gap-3 justify-center mb-4">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">{error}</p>
                {error.includes("backend") && (
                  <p className="text-xs text-destructive/80 mt-1">
                    This feature requires backend endpoint implementation for
                    secure token resolution.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {file && (
          <div className="card-base p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground break-all">
                {file.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Downloading..." : "Download File"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
