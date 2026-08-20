import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", isHost: false });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-display font-medium mb-1">Create your account</h1>
      <p className="text-sm text-ink/60 mb-6">Join Wayfare to book stays or list your own space.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-field" htmlFor="name">
            Full name
          </label>
          <input id="name" name="name" required value={form.name} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-field" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-ink/80">
          <input
            type="checkbox"
            name="isHost"
            checked={form.isHost}
            onChange={handleChange}
            className="rounded border-stone-line text-moss focus:ring-moss"
          />
          I want to host stays on Wayfare
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-moss underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
