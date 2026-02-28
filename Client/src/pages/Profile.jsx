import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-page fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header">
        <h2 className="page-title text-gradient">Account Overview</h2>
        <p className="page-subtitle">Manage your personal information and preferences.</p>
      </div>

      <div className="glass" style={{ padding: 'var(--space-2xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'var(--grad-primary)',
          margin: '0 auto var(--space-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          fontWeight: '800',
          color: 'white',
          boxShadow: 'var(--shadow-glow)'
        }}>
          {user?.email?.[0].toUpperCase()}
        </div>

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="input-group">
              <label className="input-label">Email Connected</label>
              <div className="input-field" style={{ textAlign: 'left' }}>{user.email}</div>
            </div>

            <div style={{ marginTop: 'var(--space-lg)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="glass" style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }} className="text-gradient">0</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Doubts Asked</div>
              </div>
              <div className="glass" style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800' }} className="text-gradient">0</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Answers Provided</div>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>Please login to view profile.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
