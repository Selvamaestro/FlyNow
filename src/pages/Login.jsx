import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await adminLogin(email, password);

      navigate("/admin");
    } catch (err) {
      setError("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1 className="logo">FlyNow</h1>

        <h2>Admin Portal</h2>

        <p>Login to manage the FlyNow platform.</p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;