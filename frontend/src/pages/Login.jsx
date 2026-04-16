import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchJson } from "../api/apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { setAuthData, setNotification } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchJson("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      setAuthData(data);
      setNotification({ type: "success", message: "Welcome back!" });
      navigate("/posts");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <article className="login-page">
      <header>
        <h2 className="h2 article-title">Login</h2>
      </header>

      <section className="login-intro">
        <figure className="login-image">
          <img
            src="/assets/images/avatar-2.png"
            alt="Login to your account"
            width="100"
            height="100"
          />
        </figure>

        <div className="login-text">
          <h3 className="h3">Welcome Back</h3>
          <p>
            Sign in to your account to access your profile, view your posts, and stay connected with our community.
          </p>
        </div>
      </section>

      <form className="form auth-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Email address"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-link-row">
          <Link to="/forgot-password" className="auth-link subtle-link">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="form-btn">
          <ion-icon name="log-in-outline"></ion-icon>
          <span>Login</span>
        </button>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Need an account?{" "}
            <Link to="/register" className="auth-link accent-link">
              Register now
            </Link>
          </p>
        </div>
      </form>
    </article>
  );
}

export default Login;
