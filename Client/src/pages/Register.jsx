import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ✅ Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Optional: add display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // No need to navigate, PublicRoute will handle redirect when user is synced
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)' }}>Join EduSphere and start collaborating</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-field"
            />
          </div>

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

          <button disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
            {loading ? "Creating account..." : "Register"}
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
          onClick={handleGoogleRegister}
          disabled={loading}
          className="btn btn-outline"
          style={{ width: '100%' }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
          {loading ? "Creating account..." : "Continue with Google"}
        </button>

        <p className="auth-link" style={{ textAlign: 'center', marginTop: 'var(--space-lg)', color: 'var(--text-muted)' }}>
          Already have an account?{" "}
          <Link to="/login" className="text-gradient">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

