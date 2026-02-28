import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDoubtById } from "../services/doubtService";
import { postAnswer, getAnswersByDoubt } from "../services/answerService";
import { useAuth } from "../context/AuthContext";

const AnswerDoubt = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [doubt, setDoubt] = useState(null);
    const [previousAnswers, setPreviousAnswers] = useState([]);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doubtData, answersData] = await Promise.all([
                    getDoubtById(id),
                    getAnswersByDoubt(id)
                ]);
                setDoubt(doubtData);
                setPreviousAnswers(answersData);
            } catch (err) {
                setError("Failed to load doubt details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!answer.trim()) return;

        setSubmitting(true);
        setError("");

        try {
            if (!user || !user.token) {
                throw new Error("You must be logged in to answer.");
            }

            await postAnswer(id, answer, user.token);
            navigate(`/doubts/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to post answer.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="loading-spinner"></div>
            <p className="ml-2 text-muted-foreground">Loading doubt...</p>
        </div>
    );

    if (error && !doubt) return (
        <div className="glass p-8 text-center rounded-lg border border-red-500/30">
            <p className="text-red-400">{error}</p>
            <button onClick={() => navigate('/doubts')} className="btn btn-outline mt-4">Back to Doubts</button>
        </div>
    );

    return (
        <div className="answer-doubt-page fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header">
                <h2 className="page-title text-gradient">Provide an Answer</h2>
                <p className="page-subtitle">Your expertise helps the community grow.</p>
            </div>

            {/* Doubt Context */}
            <div className="glass mb-8" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--accent-blue)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: 'var(--space-xs)', color: 'var(--text-main)' }}>
                    Question: {doubt.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {doubt.description}
                </p>
                <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-md)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Subject: {doubt.subject}</span>
                    <span>Semester: {doubt.semester}</span>
                </div>
            </div>

            {/* Previous Answers */}
            {previousAnswers.length > 0 && (
                <div className="mb-8">
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: 'var(--space-md)', color: 'var(--text-main)' }}>
                        Previous Answers ({previousAnswers.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        {previousAnswers.map((prev) => (
                            <div key={prev._id} className="glass" style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>{prev.content}</p>
                                <div style={{ marginTop: 'var(--space-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>By: {prev.answeredBy?.email || "Anonymous"}</span>
                                    <span>{new Date(prev.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Answer Form */}
            <div className="glass" style={{ padding: 'var(--space-2xl)', borderRadius: 'var(--radius-lg)' }}>
                {error && <div className="error-message mb-4" style={{ color: 'var(--error-red)', padding: 'var(--space-md)', background: 'rgba(255, 107, 107, 0.1)', borderRadius: 'var(--radius-sm)' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="input-group">
                        <label className="input-label">Your Solution</label>
                        <textarea
                            name="answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="input-field"
                            placeholder="Explain your solution clearly and concisely..."
                            rows="10"
                            style={{ resize: 'none' }}
                            required
                        />
                    </div>

                    <div className="flex gap-4" style={{ marginTop: 'var(--space-md)' }}>
                        <button
                            type="button"
                            onClick={() => navigate(`/doubts/${id}`)}
                            className="btn btn-outline"
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary"
                            style={{ flex: 2 }}
                        >
                            {submitting ? "Posting..." : "Submit Answer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnswerDoubt;
