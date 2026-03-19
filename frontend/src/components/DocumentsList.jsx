import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function DocumentsList({ projectId, refreshTrigger }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDocuments() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/documents/", {
        params: { project: projectId },
      });
      setDocuments(res.data);
    } catch (err) {
      setError(
        "Failed to load documents: " + (err?.message || "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, [projectId, refreshTrigger]);

  function getTypeIcon(type) {
    const icons = {
      bom: "📋",
      report: "📊",
      specification: "📐",
      other: "📄",
    };
    return icons[type] || "📄";
  }

  function getTypeLabel(type) {
    const labels = {
      bom: "Bill of Materials",
      report: "Report",
      specification: "Specification",
      other: "Other",
    };
    return labels[type] || type;
  }

  if (loading) return <div className="card">Loading documents...</div>;

  return (
    <div className="card">
      <h3 className="h2">📄 Project Documents</h3>

      {error && <div className="alert">{error}</div>}

      {documents.length === 0 ? (
        <p className="muted">No documents uploaded yet</p>
      ) : (
        <div style={{ display: "grid", gap: "12px" }}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                padding: "12px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "8px",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  >
                    {getTypeIcon(doc.document_type)} {doc.title}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      marginBottom: "6px",
                    }}
                  >
                    {getTypeLabel(doc.document_type)} • v{doc.version} • by{" "}
                    {doc.uploaded_by_username}
                  </div>
                  {doc.description && (
                    <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                      {doc.description}
                    </div>
                  )}
                </div>
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    textDecoration: "none",
                    fontSize: "12px",
                    padding: "6px 10px",
                    height: "auto",
                  }}
                >
                  📥 Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
