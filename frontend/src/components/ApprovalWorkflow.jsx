import { useState } from "react";
import { api } from "../lib/api";

export function ApprovalWorkflow({ project, onApprovalAction }) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleApprove() {
    setLoading(true);
    setError("");
    try {
      await api.post(`/api/projects/${project.id}/approve/`, { notes });
      setNotes("");
      if (onApprovalAction) onApprovalAction();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.response?.statusText ||
        "Failed to approve";
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!window.confirm("Are you sure you want to reject this project?"))
      return;
    setLoading(true);
    setError("");
    try {
      await api.post(`/api/projects/${project.id}/reject/`, { notes });
      setNotes("");
      if (onApprovalAction) onApprovalAction();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.response?.statusText ||
        "Failed to reject";
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestRevision() {
    if (!notes.trim()) {
      setError("❌ Please provide revision notes");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post(`/api/projects/${project.id}/request_revision/`, {
        notes,
      });
      setNotes("");
      if (onApprovalAction) onApprovalAction();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.response?.statusText ||
        "Failed to request revision";
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadge = () => {
    const status = project.approval_status;
    const badges = {
      pending: "⏳ Pending",
      approved: "✅ Approved",
      rejected: "❌ Rejected",
    };
    return badges[status] || status;
  };

  return (
    <div className="card">
      <h3 className="h2">📋 Approval Workflow</h3>

      <div
        style={{
          marginBottom: "16px",
          padding: "12px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "8px",
        }}
      >
        <p
          style={{ margin: "0 0 8px", color: "var(--muted)", fontSize: "12px" }}
        >
          Status
        </p>
        <p style={{ margin: "0", fontSize: "18px", fontWeight: "600" }}>
          {getStatusBadge()}
        </p>
      </div>

      {project.approval_notes && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            background: "rgba(96, 165, 250, 0.1)",
            borderRadius: "8px",
            borderLeft: "3px solid var(--primary)",
          }}
        >
          <p
            style={{
              margin: "0 0 4px",
              color: "var(--muted)",
              fontSize: "12px",
            }}
          >
            Notes
          </p>
          <p style={{ margin: "0", fontSize: "14px" }}>
            {project.approval_notes}
          </p>
        </div>
      )}

      {project.approved_by_username && (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px",
            background: "rgba(16, 185, 129, 0.1)",
            borderRadius: "8px",
          }}
        >
          <p
            style={{
              margin: "0 0 4px",
              color: "var(--muted)",
              fontSize: "12px",
            }}
          >
            Approved By
          </p>
          <p style={{ margin: "0", fontSize: "14px" }}>
            {project.approved_by_username}
          </p>
        </div>
      )}

      {error && <div className="alert">{error}</div>}

      <div className="form">
        <label className="label">
          Comments / Notes
          <textarea
            className="input"
            placeholder="Add approval notes or feedback"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              minHeight: "80px",
              fontFamily: "inherit",
              padding: "8px 12px",
            }}
          />
        </label>

        {project.approval_status === "pending" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
            }}
          >
            <button
              className="btn"
              style={{
                background: "rgba(16, 185, 129, 0.2)",
                borderColor: "#10b981",
              }}
              onClick={handleApprove}
              disabled={loading}
            >
              ✅ Approve
            </button>
            <button
              className="btn"
              style={{
                background: "rgba(248, 113, 113, 0.2)",
                borderColor: "#f87171",
              }}
              onClick={handleReject}
              disabled={loading}
            >
              ❌ Reject
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleRequestRevision}
              disabled={loading || !notes.trim()}
            >
              🔄 Request Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
