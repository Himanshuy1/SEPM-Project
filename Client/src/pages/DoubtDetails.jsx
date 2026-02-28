import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getDoubtById } from "../services/doubtService";
import { getAnswersByDoubt, postAnswer, upvoteAnswer } from "../services/answerService";
import { useAuth } from "../context/AuthContext";

const DoubtDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [doubt, setDoubt] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [newAnswer, setNewAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answerLoading, setAnswerLoading] = useState(false);

    useEffect(() => {
        fetchDoubtAndAnswers();
    }, [id]);

    const fetchDoubtAndAnswers = async () => {
        try {
            const [doubtData, answersData] = await Promise.all([
                getDoubtById(id),
                getAnswersByDoubt(id)
            ]);
            setDoubt(doubtData);
            setAnswers(answersData);
        } catch (err) {
            console.error(err);
            setError("Failed to load doubt details.");
        } finally {
            setLoading(false);
        }
    };

    const handlePostAnswer = async (e) => {
        e.preventDefault();
        if (!newAnswer.trim()) return;

        setAnswerLoading(true);
        try {
            if (!user) throw new Error("Login to answer");
            await postAnswer(id, newAnswer, user.token);
            setNewAnswer("");
            // Refresh answers
            const updatedAnswers = await getAnswersByDoubt(id);
            setAnswers(updatedAnswers);
        } catch (err) {
            alert(err.message || "Failed to post answer");
        } finally {
            setAnswerLoading(false);
        }
    };

    const handleUpvote = async (answerId) => {
        try {
            if (!user) return alert("Login to upvote");
            await upvoteAnswer(answerId, user.token);
            // Optimistic update or refresh
            const updatedAnswers = await getAnswersByDoubt(id);
            setAnswers(updatedAnswers);
        } catch (err) {
            console.error(err);
            alert("Failed to upvote");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!doubt) return <div>Doubt not found</div>;

    return (
        <div className="doubt-details-page fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass" style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-xl)', border: '1px solid var(--border-bright)' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)' }}>{doubt.title}</h1>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', opacity: 0.9, lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{doubt.description}</p>
                <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>Asked by {doubt.createdBy?.email} • {new Date(doubt.createdAt).toLocaleDateString()}</span>
                    <Link to={`/doubts/${id}/answer`} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                        Answer This Doubt
                    </Link>
                </div>
            </div>

            <div className="answers-section">
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Answers <span className="glass" style={{ fontSize: '0.9rem', padding: '2px 10px', borderRadius: '20px' }}>{answers.length}</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
                    {answers.map((ans) => (
                        <div key={ans._id} className="glass" style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>{ans.content}</p>
                            <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-sm)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>By: {ans.answeredBy?.email}</span>
                                <button
                                    onClick={() => handleUpvote(ans._id)}
                                    className="btn btn-outline"
                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                                >
                                    Helpful? ({ans.upvotes?.length || 0})
                                </button>
                            </div>
                        </div>
                    ))}
                    {answers.length === 0 && (
                        <div className="glass" style={{ padding: 'var(--space-xl)', textAlign: 'center', borderRadius: 'var(--radius-md)', opacity: 0.7 }}>
                            <p className="italic">No answers yet. Be the first to help!</p>
                        </div>
                    )}
                </div>

                {user ? (
                    <div className="glass" style={{ padding: 'var(--space-xl)', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                        <Link to={`/doubts/${id}/answer`} className="btn btn-primary" style={{ width: '100%' }}>
                            Write an Answer
                        </Link>
                    </div>
                ) : (
                    <div className="glass" style={{ padding: 'var(--space-lg)', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                        <p>Please <Link to="/login" className="text-gradient">login</Link> to post an answer.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoubtDetails;
