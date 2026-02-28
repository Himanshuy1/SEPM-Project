import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page fade-in" style={{
      minHeight: 'calc(100vh - var(--header-height) - var(--space-2xl))',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 var(--space-xl)'
    }}>
      <section className="hero-section" style={{
        textAlign: 'center',
        padding: 'var(--space-2xl) 0',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%'
      }}>
        <h1 className="page-title">
          The Future of <br />
          <span className="text-gradient" style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)' }}>Collaborative Learning</span>
        </h1>
        <p className="page-subtitle" style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
          Join EduSphere, a futuristic platform where students connect, solve doubts, and share resources in real-time.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/doubts" className="btn btn-primary">
            Ask a Doubt
          </Link>
          <Link to="/resources" className="btn btn-outline">
            Browse Resources
          </Link>
        </div>
      </section>

      <section className="features-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-lg)',
        marginTop: 'var(--space-2xl)',
        maxWidth: '1200px',
        width: '100%',
        margin: 'var(--space-2xl) auto 0'
      }}>
        <div className="glass" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="text-gradient">Instant Doubt Solving</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
            Get your questions answered by experts and peers in our vibrant community.
          </p>
        </div>
        <div className="glass" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="text-gradient">Resource Hub</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
            Access a curated library of study materials, notes, and previous year papers.
          </p>
        </div>
        <div className="glass" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)' }}>
          <h3 className="text-gradient">Real-time Collab</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
            Work together with your classmates on complex problems and projects.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
