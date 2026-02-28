import { useEffect, useState } from "react";
import { getAllDoubts } from "../services/doubtService";
import { Link } from "react-router-dom";

const Doubts = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const data = await getAllDoubts();
        setDoubts(data);
      } catch (err) {
        setError("Failed to load doubts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoubts();
  }, []);

  if (loading) return <div>Loading doubts...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="doubts-page fade-in">
      <div className="page-header">
        <h2 className="page-title text-gradient">Knowledge Base</h2>
        <p className="page-subtitle">Browse and solve doubts from your fellow learners.</p>
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <Link to="/doubts/new" className="btn btn-primary">
            Ask New Doubt
          </Link>
        </div>
      </div>

      {doubts.length === 0 ? (
        <div className="glass" style={{ padding: 'var(--space-2xl)', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ color: 'var(--text-muted)' }}>No doubts found. Be the first to ask!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {doubts.map((d) => (
            <div key={d._id} className="glass content-card" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <Link to={`/doubts/${d._id}`} style={{ display: 'block' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: 'var(--space-xs)' }} className="hover:text-gradient">{d.title}</h4>
              </Link>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>{d.description}</p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-sm)' }}>
                <span className="glass" style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>{d.subject}</span>
                <span className="glass" style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>Sem {d.semester}</span>
                <span style={{ marginLeft: 'auto' }}>By: {d.createdBy?.email?.split('@')[0]}</span>
              </div>
              <div style={{ marginTop: 'var(--space-md)' }}>
                <Link to={`/doubts/${d._id}/answer`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                  Answer This Doubt
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doubts;
