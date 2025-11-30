import { Link } from "react-router-dom";
import { Cloud } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-6">
          <Cloud className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Page not found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/" className="btn-primary inline-block">
          Go back home
        </Link>
      </div>
    </div>
  );
}
