import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDoubt } from "../services/doubtService";
import { useAuth } from "../context/AuthContext";

const CreateDoubt = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        subject: "",
        semester: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { user } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!user || !user.token) {
                throw new Error("You must be logged in.");
            }

            await createDoubt(formData, user.token);
            navigate("/doubts");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to post doubt.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-doubt-page fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="page-header text-center">
                <h2 className="page-title text-gradient">Ask the Community</h2>
                <p className="page-subtitle">Get help from peer learners and experts.</p>
            </div>

            <div className="glass" style={{ padding: 'var(--space-2xl)', borderRadius: 'var(--radius-lg)' }}>
                {error && <div className="error-message mb-4" style={{ color: 'var(--error-red)', padding: 'var(--space-md)', background: 'rgba(255, 107, 107, 0.1)', borderRadius: 'var(--radius-sm)' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="input-group">
                        <label className="input-label">Short Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g., How does useEffect work in React?"
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                        <div className="input-group">
                            <label className="input-label">Subject</label>
                            <input
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., Web Development"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Semester</label>
                            <select
                                name="semester"
                                value={formData.semester}
                                onChange={handleChange}
                                className="input-field"
                                style={{ appearance: 'none' }}
                                required
                            >
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <option key={s} value={s} style={{ background: '#1a1f2e' }}>Semester {s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Detailed Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Provide context, what you've tried, and what you're stuck on..."
                            rows="6"
                            style={{ resize: 'none' }}
                            required
                        />
                    </div>

                    <div className="flex gap-4" style={{ marginTop: 'var(--space-md)' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/doubts')}
                            className="btn btn-outline"
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ flex: 2 }}
                        >
                            {loading ? "Posting..." : "Submit Question"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDoubt;
