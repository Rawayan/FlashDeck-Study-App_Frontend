import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { registerUser } from "../api/auth";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);

    try {
      await registerUser(form);

      /*
       * Registration is successful.
       * Send the user to Login so they can authenticate.
       */
      navigate("/login", {
        replace: true,
        state: {
          registered: true,
        },
      });
    } catch (err) {
      console.error("Registration error:", err);

      setErrors(
        err.response?.data || {
          detail: "Registration failed.",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-card">
        <h2>Create your account</h2>

        <p className="auth-intro">
          Build your decks, review smarter, and
          keep your learning organized.
        </p>

        {(errors.detail ||
          errors.username ||
          errors.email ||
          errors.password) && (
          <div className="auth-error auth-errors">
            {errors.detail && (
              <p>{errors.detail}</p>
            )}

            {errors.username && (
              <p>
                {Array.isArray(errors.username)
                  ? errors.username.join(" ")
                  : errors.username}
              </p>
            )}

            {errors.email && (
              <p>
                {Array.isArray(errors.email)
                  ? errors.email.join(" ")
                  : errors.email}
              </p>
            )}

            {errors.password && (
              <p>
                {Array.isArray(errors.password)
                  ? errors.password.join(" ")
                  : errors.password}
              </p>
            )}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </section>
    </div>
  );
}

export default Register;