import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../api/apiClient.js";

const INITIAL = {
  fullname: "",
  username: "",
  email: "",
  birthdate: "",
  password: "",
  confirmPassword: "",
  level: "",
  terms: false,
};
const INITIAL_ERRORS = {
  fullname: "",
  username: "",
  email: "",
  birthdate: "",
  password: "",
  confirmPassword: "",
  level: "",
  terms: "",
};

function calculateAge(dateStr) {
  const birth = new Date(dateStr);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

function validateField(name, value, allValues) {
  if (name === "terms")
    return value ? "" : "You must accept the terms and conditions";
  if (name === "level") return value ? "" : "Please select your interest level";
  if (!value || (typeof value === "string" && !value.trim()))
    return "This field is required";

  switch (name) {
    case "fullname":
      return value.trim().length < 3
        ? "Full name must be at least 3 characters"
        : "";
    case "username":
      if (value.trim().length < 3)
        return "Username must be at least 3 characters";
      if (!/^[a-zA-Z0-9_]+$/.test(value))
        return "Username can only contain letters, numbers, and underscores";
      return "";
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : "Please enter a valid email address";
    case "birthdate":
      return calculateAge(value) < 18
        ? "You must be at least 18 years old"
        : "";
    case "password":
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/[A-Z]/.test(value))
        return "Password must contain at least one uppercase letter";
      if (!/[0-9]/.test(value))
        return "Password must contain at least one number";
      return "";
    case "confirmPassword":
      return value !== allValues.password ? "Passwords do not match" : "";
    default:
      return "";
  }
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
    if (type !== "checkbox" && value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (type === "checkbox" && checked) {
      setErrors((prev) => ({ ...prev, terms: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, val, form),
    }));
  };

  const handleRadioChange = (e) => {
    setForm((prev) => ({ ...prev, level: e.target.value }));
    setErrors((prev) => ({ ...prev, level: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;
    Object.keys(INITIAL).forEach((key) => {
      const err = validateField(key, form[key], form);
      newErrors[key] = err;
      if (err) isValid = false;
    });
    setErrors(newErrors);
    if (!isValid) return;

    try {
      await fetchJson("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullname: form.fullname,
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      setMessage("Account created successfully. Redirecting to login...");
      setError("");
      setForm(INITIAL);
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <article className="register" data-page="register">
      <header>
        <h2 className="h2 article-title">Join Our Community</h2>
      </header>

      <section className="register-intro">
        <figure className="register-image">
          <img
            src="/assets/images/avatar-4.png"
            alt="Join our community"
            width="100"
            height="100"
          />
        </figure>

        <div className="register-text">
          <h3 className="h3">Stay Updated with Latest Insights</h3>
          <p>
            Sign up to receive exclusive updates, tutorials, and insights about
            web development, design trends, and technology innovations.
          </p>
          <ul className="benefits-list">
            <li>Monthly newsletter with industry insights and tips</li>
            <li>Early access to new tutorials and resources</li>
            <li>Exclusive webinar invitations and Q&amp;A sessions</li>
            <li>Free downloadable templates and code snippets</li>
          </ul>
        </div>
      </section>

      <form
        className="form register-form"
        onSubmit={handleSubmit}
        data-form
        noValidate
      >
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="input-wrapper">
          <div className="form-group">
            <input
              type="text"
              name="fullname"
              className="form-input"
              placeholder="Full Name"
              value={form.fullname}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              data-form-input
            />
            <span className="error-message">{errors.fullname}</span>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Preferred Username"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              data-form-input
            />
            <span className="error-message">{errors.username}</span>
          </div>
        </div>

        <div className="input-wrapper">
          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              data-form-input
            />
            <span className="error-message">{errors.email}</span>
          </div>
          <div className="form-group">
            <input
              type="date"
              name="birthdate"
              className="form-input"
              value={form.birthdate}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              data-form-input
            />
            <span className="error-message">{errors.birthdate}</span>
          </div>
        </div>

        <div className="input-wrapper">
          <div className="form-group">
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              data-form-input
            />
            <span className="error-message">{errors.password}</span>
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              data-form-input
            />
            <span className="error-message">{errors.confirmPassword}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Interest Level:</label>
          <div className="radio-group">
            {["beginner", "intermediate", "expert"].map((level) => (
              <label key={level} className="radio-label">
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={form.level === level}
                  onChange={handleRadioChange}
                />
                <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
              </label>
            ))}
          </div>
          <span className="error-message">{errors.level}</span>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <span>I agree to the terms and conditions and privacy policy</span>
          </label>
          <span className="error-message">{errors.terms}</span>
        </div>

        <button className="form-btn" type="submit" data-form-btn>
          <ion-icon name="person-add-outline"></ion-icon>
          <span>Create Account</span>
        </button>
      </form>
    </article>
  );
}

export default Register;
