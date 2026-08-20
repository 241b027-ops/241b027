import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-lg mx-auto px-4 py-24 text-center">
    <p className="text-6xl font-display text-moss mb-4">404</p>
    <h1 className="text-xl font-display mb-2">Page not found</h1>
    <p className="text-sm text-ink/60 mb-6">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary">
      Back to home
    </Link>
  </div>
);

export default NotFound;
