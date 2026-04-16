import { useState } from "react";
import { fetchJson } from "../api/apiClient.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchJson("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(`Reset link generated. Open: ${data.resetUrl}`);
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <article className="auth-page">
      <header>
        <h2 className="h2 article-title">Forgot Password</h2>
      </header>

      <form className="form auth-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="form-btn">
          <ion-icon name="mail-open-outline"></ion-icon>
          <span>Send reset link</span>
        </button>
      </form>
    </article>
  );
}

export default ForgotPassword;
