import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import aiService from "../services/aiService";

const Summariser = () => {
  const [mode, setMode] = useState("text"); // "text" or "file"
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleSummarize = async (e) => {
    e.preventDefault();

    if (mode === "text" && !text.trim()) return;
    if (mode === "file" && !file) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      let data;
      if (mode === "text") {
        data = await aiService.summarizeText(text, user.token);
      } else {
        data = await aiService.summarizeFile(file, user.token);
      }
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (ext !== 'pdf' && ext !== 'pptx' && ext !== 'ppt') {
        setError("Please select a PDF or PPTX file.");
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size should be less than 10MB.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  return (
    <div className="summariser-container animate-fade-in">
      <div className="summariser-header">
        <h1 className="text-gradient">AI Summarizer</h1>
        <p className="text-muted">Transform long notes, PDFs, or PPTs into concise summaries.</p>
      </div>

      <div className="summariser-tabs">
        <button
          className={`tab-btn ${mode === 'text' ? 'active' : ''}`}
          onClick={() => { setMode('text'); setSummary(''); setError(''); }}
        >
          Paste Text
        </button>
        <button
          className={`tab-btn ${mode === 'file' ? 'active' : ''}`}
          onClick={() => { setMode('file'); setSummary(''); setError(''); }}
        >
          Upload File
        </button>
      </div>

      <div className="glass-card summariser-card">
        <form onSubmit={handleSummarize} className="summariser-form">
          {mode === 'text' ? (
            <div className="form-group text-mode-container">
              <div className="label-row">
                <label htmlFor="text-input" className="form-label">Paste your text here</label>
                <div className="text-actions">
                  {text && (
                    <button
                      type="button"
                      className="action-link clear-btn"
                      onClick={() => setText("")}
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    className="action-link paste-btn"
                    onClick={async () => {
                      try {
                        const clipboardText = await navigator.clipboard.readText();
                        setText(clipboardText);
                      } catch (err) {
                        console.error("Failed to read clipboard:", err);
                      }
                    }}
                  >
                    Paste from Clipboard
                  </button>
                </div>
              </div>
              <div className="textarea-wrapper">
                <textarea
                  id="text-input"
                  className="form-input summariser-textarea enhanced-textarea"
                  placeholder="Enter educational notes, articles, or any long text..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={10}
                  required
                ></textarea>
                <div className="textarea-footer">
                  <span className={`char-count ${text.length > 5000 ? 'warning' : ''}`}>
                    {text.length.toLocaleString()} characters
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="file-upload-container">
              <label htmlFor="file-input" className="file-upload-label">
                <div className="upload-icon">📁</div>
                <span className="upload-text">
                  {file ? file.name : "Click to upload or drag and drop"}
                </span>
                <span className="upload-hint">Supported formats: PDF, PPTX (Max 10MB)</span>
                <input
                  id="file-input"
                  type="file"
                  className="file-input-hidden"
                  accept=".pdf,.pptx,.ppt"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary summariser-btn ${loading ? 'loading' : ''}`}
            disabled={loading || (mode === 'text' ? !text.trim() : !file)}
          >
            {loading ? (
              <span className="spinner-container">
                <span className="spinner"></span>
                {mode === 'file' ? 'Extracting & Summarizing...' : 'Summarizing...'}
              </span>
            ) : (
              "Generate Summary"
            )}
          </button>
        </form>

        {error && (
          <div className="error-message glass-error">
            <p>{error}</p>
          </div>
        )}

        {summary && (
          <div className="summary-result animate-slide-up">
            <div className="summary-divider"></div>
            <h3 className="summary-title">Summary Result</h3>
            <div className="summary-content">
              {summary.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <button
              className="btn btn-outline btn-sm copy-btn"
              onClick={() => navigator.clipboard.writeText(summary)}
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .summariser-container {
          max-width: 900px;
          margin: 2rem auto;
          padding: 0 1rem;
        }

        .summariser-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .summariser-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .summariser-card {
          padding: 2rem;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .summariser-textarea {
          resize: vertical;
          min-height: 200px;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-family: inherit;
          line-height: 1.6;
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .summariser-textarea:focus {
          outline: none;
          border-color: var(--primary-color, #007bff);
          background: rgba(0, 0, 0, 0.3);
          box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1), inset 0 0 10px rgba(0, 123, 255, 0.05);
        }

        .text-mode-container {
          position: relative;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem;
        }

        .text-actions {
          display: flex;
          gap: 1rem;
        }

        .action-link {
          background: none;
          border: none;
          color: var(--primary-color, #007bff);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          opacity: 0.8;
          transition: all 0.2s ease;
          padding: 0;
        }

        .action-link:hover {
          opacity: 1;
          text-decoration: underline;
        }

        .clear-btn {
          color: #ff6b6b;
        }

        .textarea-wrapper {
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .enhanced-textarea {
          width: 100%;
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }

        .textarea-footer {
          display: flex;
          justify-content: flex-end;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: none;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }

        .char-count {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .char-count.warning {
          color: #ffc107;
        }

        .summariser-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1.5rem;
          transition: all 0.3s ease;
        }

        .summariser-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 123, 255, 0.3);
        }

        .summariser-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .glass-error {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid rgba(220, 53, 69, 0.3);
          border-radius: 10px;
          color: #ff6b6b;
          text-align: center;
        }

        .summariser-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          justify-content: center;
        }

        .tab-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 0.8rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .tab-btn.active {
          background: var(--primary-color, #007bff);
          border-color: var(--primary-color, #007bff);
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        }

        .file-upload-container {
          margin-bottom: 1.5rem;
        }

        .file-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(0, 0, 0, 0.1);
        }

        .file-upload-label:hover {
          border-color: var(--primary-color, #007bff);
          background: rgba(0, 123, 255, 0.05);
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .upload-text {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .upload-hint {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .file-input-hidden {
          display: none;
        }

        .summary-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
          margin-bottom: 2rem;
        }

        .summary-title {
          font-size: 1.3rem;
          color: #fff;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .summary-content {
          background: rgba(255, 255, 255, 0.03);
          padding: 1.5rem;
          border-radius: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .summary-content p {
          margin-bottom: 1rem;
        }

        .copy-btn {
          margin-left: auto;
          display: block;
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Summariser;
