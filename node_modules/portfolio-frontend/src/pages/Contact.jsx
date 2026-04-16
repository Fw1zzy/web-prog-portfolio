// src/pages/Contact.jsx
import { useState } from "react";
import { fetchJson } from "../api/apiClient.js";

const INITIAL = { fullname: "", email: "", subject: "", message: "" };
const INITIAL_ERRORS = { fullname: "", email: "", subject: "", message: "" };

function validate(name, value) {
  if (!value.trim()) return "This field is required";
  switch (name) {
    case "fullname":
      return value.trim().length < 3
        ? "Name must be at least 3 characters"
        : "";
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ""
        : "Please enter a valid email address";
    case "subject":
      return value.trim().length < 5
        ? "Subject must be at least 5 characters"
        : "";
    case "message":
      return value.trim().length < 10
        ? "Message must be at least 10 characters"
        : "";
    default:
      return "";
  }
}

function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;
    Object.keys(form).forEach((key) => {
      const err = validate(key, form[key]);
      newErrors[key] = err;
      if (err) isValid = false;
    });
    setErrors(newErrors);
    if (!isValid) return;

    try {
      await fetchJson("/messages", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setResult("Thank you! Your message has been sent successfully.");
      setError("");
      setForm(INITIAL);
    } catch (err) {
      setError(err.message);
      setResult("");
    }
  };

  return (
    <article className="contact" data-page="contact">
      <header>
        <h2 className="h2 article-title">Contact</h2>
      </header>

      <section className="contact-intro">
        <figure className="contact-image">
          <img
            src="/assets/images/avatar-2.png"
            alt="Get in touch with us"
            width="100"
            height="100"
          />
        </figure>

        <div className="contact-text">
          <h3 className="h3">Get In Touch</h3>
          <p>
            Have questions or want to collaborate? I'd love to hear from you. Send me a message and I'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="contact-form">
        {result && <p className="success-message">{result}</p>}
        {error && <p className="error-message">{error}</p>}

        <form
          className="form contact-form"
          onSubmit={handleSubmit}
          data-contact-form
        >
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
          </div>

          <div className="form-group">
            <input
              type="text"
              name="subject"
              className="form-input"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              data-form-input
            />
            <span className="error-message">{errors.subject}</span>
          </div>

          <div className="form-group">
            <textarea
              name="message"
              className="form-input"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              data-form-input
              rows="6"
            ></textarea>
            <span className="error-message">{errors.message}</span>
          </div>

          <button className="form-btn" type="submit">
            <ion-icon name="paper-plane"></ion-icon>
            <span>Send Message</span>
          </button>
        </form>
      </section>
    </article>
  );
}

export default Contact;
