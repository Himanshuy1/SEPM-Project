import { useEffect, useState } from "react";
import { getAllResources, uploadResource } from "../services/resourceService";
import { useAuth } from "../context/AuthContext";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Folder navigation state
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'link'
  const [uploadData, setUploadData] = useState({
    title: "",
    subject: "",
    semester: "",
    description: "",
    file: null,
    externalLink: ""
  });
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const data = await getAllResources();
      setResources(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadData({ ...uploadData, file: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setUploadData({ ...uploadData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (uploadType === 'file' && !uploadData.file) return alert("Please select a file");
    if (uploadType === 'link' && !uploadData.externalLink) return alert("Please provide a link");

    setUploadLoading(true);

    try {
      if (uploadType === 'file') {
        const formData = new FormData();
        formData.append("title", uploadData.title);
        formData.append("subject", uploadData.subject);
        formData.append("semester", uploadData.semester);
        formData.append("description", uploadData.description);
        formData.append("file", uploadData.file);
        await uploadResource(formData, user.token);
      } else {
        await uploadResource({
          title: uploadData.title,
          subject: uploadData.subject,
          semester: uploadData.semester,
          description: uploadData.description,
          externalLink: uploadData.externalLink
        }, user.token);
      }

      alert("Resource published successfully!");
      setShowUpload(false);
      setUploadData({ title: "", subject: "", semester: "", description: "", file: null, externalLink: "" });
      fetchResources();
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setUploadLoading(false);
    }
  };

  // Group resources by subject
  const groupedResources = resources.reduce((acc, res) => {
    if (!acc[res.subject]) {
      acc[res.subject] = [];
    }
    acc[res.subject].push(res);
    return acc;
  }, {});

  const subjects = Object.keys(groupedResources);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="loading-spinner"></div>
      <p className="ml-2 text-muted-foreground">Loading resources...</p>
    </div>
  );

  return (
    <div className="resources-page fade-in">
      <div className="page-header">
        <h2 className="page-title text-gradient">Learning Resources</h2>
        <p className="page-subtitle">
          {selectedSubject
            ? `Resources for ${selectedSubject}`
            : "Curated materials to help you excel in your studies."}
        </p>
        <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)' }}>
          {selectedSubject && (
            <button
              onClick={() => setSelectedSubject(null)}
              className="btn btn-outline"
            >
              ← Back to Subjects
            </button>
          )}
          <button
            onClick={() => setShowUpload(!showUpload)}
            className={`btn ${showUpload ? 'btn-outline' : 'btn-primary'}`}
          >
            {showUpload ? "Cancel Upload" : "Upload Resource"}
          </button>
        </div>
      </div>

      {showUpload && (
        <div className="glass" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-2xl)', border: '1px solid var(--border-bright)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: 'var(--space-lg)' }}>Upload New Resource</h3>

          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUploadType('file')}
              className={`btn btn-sm ${uploadType === 'file' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: 1 }}
            >
              📄 Upload File
            </button>
            <button
              type="button"
              onClick={() => setUploadType('link')}
              className={`btn btn-sm ${uploadType === 'link' ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: 1 }}
            >
              🔗 Provide Link
            </button>
          </div>

          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
              <div className="input-group">
                <label className="input-label">Title</label>
                <input name="title" placeholder="e.g., Mathematics Notes" value={uploadData.title} onChange={handleInputChange} className="input-field" required />
              </div>
              <div className="input-group">
                <label className="input-label">Subject</label>
                <input name="subject" placeholder="e.g., Calculus" value={uploadData.subject} onChange={handleInputChange} className="input-field" required />
              </div>
              <div className="input-group">
                <label className="input-label">Semester</label>
                <select name="semester" value={uploadData.semester} onChange={handleInputChange} className="input-field" required>
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s} style={{ background: '#1a1f2e' }}>Semester {s}</option>)}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea name="description" placeholder="Briefly describe the resource..." value={uploadData.description} onChange={handleInputChange} className="input-field" rows="2" />
            </div>

            {uploadType === 'file' ? (
              <div className="input-group">
                <label className="input-label">Select File (PDF, DOCX, etc.)</label>
                <input type="file" onChange={handleFileChange} className="input-field" style={{ padding: '0.6rem' }} required={uploadType === 'file'} />
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Max size: 10MB</p>
              </div>
            ) : (
              <div className="input-group">
                <label className="input-label">External Link (Google Drive, GitHub, etc.)</label>
                <input
                  name="externalLink"
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={uploadData.externalLink}
                  onChange={handleInputChange}
                  className="input-field"
                  required={uploadType === 'link'}
                />
              </div>
            )}

            <button disabled={uploadLoading} className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>
              {uploadLoading ? "Processing..." : "Publish Resource"}
            </button>
          </form>
        </div>
      )}

      {/* Folder View or File View */}
      {!selectedSubject ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
          {subjects.map((subject) => (
            <div
              key={subject}
              className="glass content-card pointer"
              onClick={() => setSelectedSubject(subject)}
              style={{
                padding: 'var(--space-xl)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 'var(--space-md)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(56, 189, 248, 0.1)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
              }}>
                📂
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{subject}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{groupedResources[subject].length} Resources</p>
              </div>
            </div>
          ))}
          {subjects.length === 0 && (
            <div className="glass" style={{ gridColumn: '1/-1', padding: 'var(--space-2xl)', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <p style={{ color: 'var(--text-muted)' }}>No subjects found. Be the first to share!</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
          {groupedResources[selectedSubject].map((res) => (
            <div key={res._id} className="glass content-card" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-sm)' }}>
                  <span className="glass" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '15px', color: 'var(--accent)' }}>{res.subject}</span>
                  <span className="glass" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '15px' }}>Sem {res.semester}</span>
                  {res.externalLink && <span className="glass" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '15px', background: 'rgba(56, 189, 248, 0.1)' }}>Link</span>}
                  {res.filePath && <span className="glass" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '15px', background: 'rgba(129, 140, 248, 0.1)' }}>File</span>}
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: 'var(--space-xs)' }}>{res.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-lg)' }}>{res.description}</p>
              </div>
              <a
                href={res.externalLink || `http://localhost:5000/${res.filePath.replace(/\\/g, '/')}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                style={{ width: '100%', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {res.externalLink ? "🔗 External Link" : "📄 Access Resource"}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
