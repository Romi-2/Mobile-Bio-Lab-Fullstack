// Frontend//src/components/shareSample.tsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import "../style/shareSample.css";

interface ShareSampleProps {
  sampleId?: string;
}

// Toast Notification Component
const Toast: React.FC<{
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

// Modal Component
const LinkModal: React.FC<{ 
  link: string; 
  onClose: () => void;
  onCopy: () => void;
}> = ({ link, onClose, onCopy }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Shareable Link Generated</h3>
        <div className="link-display-modal">
          {link}
        </div>
        <div className="modal-buttons">
          <button className="copy-button" onClick={onCopy}>
            Copy Link
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ShareSample: React.FC<ShareSampleProps> = ({ sampleId }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const resolvedId = sampleId || id!;

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Shared Sample Data");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  // Determine the correct URL based on current route
  const getShareableLink = () => {
    const baseUrl = window.location.origin;
    const currentPath = location.pathname;
    
    if (currentPath.includes('/dashboard/')) {
      return `${baseUrl}/dashboard/sample/${resolvedId}`;
    } else if (currentPath.includes('/user/')) {
      return `${baseUrl}/user/sample/${resolvedId}`;
    } else {
      return `${baseUrl}/sample/${resolvedId}`;
    }
  };

  const handleEmailShare = async () => {
    if (!email) {
      showToast("Please enter recipient email", "error");
      return;
    }

    if (!message.trim()) {
      showToast("Please enter a message to share with the sample data", "error");
      return;
    }

    setIsSending(true);
    try {
      await axios.post("http://localhost:5000/api/share/email", {
        to: email,
        subject: subject,
        message: message,
        sampleId: resolvedId,
      });
      showToast("Email sent successfully!", "success");
      setEmail("");
      setMessage("");
      setSubject("Shared Sample Data");
    } catch {
      showToast("Failed to send email", "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleLinkShare = async () => {
    setIsGenerating(true);
    try {
      const generatedLink = getShareableLink();
      setLink(generatedLink);
      setLinkGenerated(true);
      
      // Auto-copy to clipboard when generating
      await navigator.clipboard.writeText(generatedLink);
      showToast("Link generated and copied to clipboard!", "success");
      setShowModal(true);
    } catch {
      // If auto-copy fails, still show the modal but with info message
      const generatedLink = getShareableLink();
      setLink(generatedLink);
      setLinkGenerated(true);
      showToast("Link generated! You can copy it from the dialog.", "info");
      setShowModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      showToast("Link copied to clipboard!", "success");
      setShowModal(false);
    } catch {
      // Fallback method for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showToast("Link copied to clipboard!", "success");
        setShowModal(false);
      } catch {
        showToast("Failed to copy link to clipboard", "error");
      }
      document.body.removeChild(textArea);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const copyInlineLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      showToast("Link copied to clipboard!", "success");
    } catch {
      // Fallback method for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showToast("Link copied to clipboard!", "success");
      } catch {
        showToast("Failed to copy link to clipboard", "error");
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="share-sample">
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <h4>Share Sample Data</h4>
      
      <div className="share-email">
        <h5 className="share-heading">Share via Email</h5>
        <input
          type="email"
          placeholder="Enter recipient email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="share-input"
          required
        />
        <input
          type="text"
          placeholder="Email subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="share-input"
          required
        />
        <textarea
          placeholder="Enter your message to share with the sample data... (Required)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="share-textarea"
          rows={4}
          required
        />
        <div className="email-note">
          <small>
            <strong>Note:</strong> Your message above will be sent along with the complete sample data including Sample ID, collection details, geolocation, and field conditions.
          </small>
        </div>
        <button 
          onClick={handleEmailShare} 
          disabled={isSending}
          className="share-button"
        >
          {isSending ? "Sending..." : "Share via Email"}
        </button>
      </div>

      <div className="share-divider">
        <hr />
        <span>OR</span>
        <hr />
      </div>

      <div className="sharecopy-link">
        <h5 className="share-heading">Generate Direct Link</h5>
 
        <button 
          onClick={handleLinkShare} 
          disabled={isGenerating}
          className="share-button"
        >
          {isGenerating ? "Generating..." : "Generate & Copy Link"}
        </button>
        
        {/* Inline link display (appears on the page after generation) */}
        {linkGenerated && !showModal && (
          <div className="link-display-inline">
            <div className="link-message">
              <strong>✅ Your shareable link has been generated!</strong>
            </div>
            <div className="link-container">
              <input 
                type="text" 
                value={link} 
                readOnly 
                className="link-input"
                onClick={(e) => e.currentTarget.select()}
              />
              <button 
                onClick={copyInlineLink}
                className="copy-link-btn"
              >
                Copy Link
              </button>
            </div>
            <p className="link-instruction">
              Share this link with others to give them access to this sample data.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <LinkModal 
          link={link} 
          onClose={closeModal}
          onCopy={handleCopyLink}
        />
      )}
    </div>
  );
};

export default ShareSample;