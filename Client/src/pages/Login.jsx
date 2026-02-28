import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
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
      await signInWithEmailAndPassword(auth, email, password);
      // No need to navigate, PublicRoute will handle redirect when user is synced
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // No need to navigate, PublicRoute will handle redirect when user is synced
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="glass" style={{
        width: '100%',
        maxWidth: '450px',
        padding: 'var(--space-2xl) var(--space-xl)',
        borderRadius: 'var(--radius-lg)',
        margin: '0 auto'
      }}>
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to continue your journey</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>

          <button disabled={loading} className="btn btn-primary w-full" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="divider" style={{
          display: 'flex',
          alignItems: 'center',
          margin: '1.5rem 0',
          color: 'var(--text-muted)',
          gap: '1rem'
        }}>
          <span style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></span>
          <span style={{ fontSize: '0.9rem' }}>or</span>
          <span style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="btn btn-outline"
          style={{ width: '100%' }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="auth-link" style={{ textAlign: 'center', marginTop: 'var(--space-lg)', color: 'var(--text-muted)' }}>
          Don’t have an account?{" "}
          <Link to="/register" className="text-gradient">Create one now</Link>
        </p>
      </div>
    </div>
  );
}



