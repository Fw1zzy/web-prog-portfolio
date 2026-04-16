import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson } from "../api/apiClient.js";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await fetchJson(`/auth/reset-password/${token}`, {
        method: "PUT",
        body: JSON.stringify({ password }),
      });
      setMessage("Password reset successfully. Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <article className="auth-page">
      <header>
        <h2 className="h2 article-title">Reset Password</h2>
      </header>

      <form className="form auth-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <div className="form-group">
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirm"
            className="form-input"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="form-btn">
          <ion-icon name="refresh-circle-outline"></ion-icon>
          <span>Reset password</span>
        </button>
      </form>
    </article>
  );
}

export default ResetPassword;
