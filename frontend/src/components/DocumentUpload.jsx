import { useState } from "react";
import { api } from "../lib/api";

export function DocumentUpload({ projectId, onDocumentAdded }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("other");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    if (!file || !title) {
      setError("❌ Title and file are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("document_type", docType);
      formData.append("description", description);
      formData.append("project", projectId);

      const res = await api.post("/api/documents/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(`✅ Document "${res.data.title}" uploaded successfully!`);
      setFile(null);
      setTitle("");
      setDocType("other");
      setDescription("");

      // Refresh documents list after successful upload
      setTimeout(() => {
        if (onDocumentAdded) onDocumentAdded();
      }, 500);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.file?.[0] ||
        err?.response?.data?.title?.[0] ||
        err?.response?.statusText ||
        "Failed to upload document";
      setError(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="card">
      <h3 className="h2">📄 Upload Document</h3>

      {error && <div className="alert">{error}</div>}
      {success && (
        <div
          className="alert"
          style={{ color: "#10b981", borderColor: "#10b981" }}
        >
          {success}
        </div>
      )}

      <div className="form">
        <label className="label">
          Document Title
          <input
            className="input"
            type="text"
            placeholder="e.g., BOM v1.0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="label">
          Document Type
          <select
            className="input"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
          >
            <option value="bom">Bill of Materials (BOM)</option>
            <option value="report">Report</option>
            <option value="specification">Specification</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="label">
          Description
          <textarea
            className="input"
            placeholder="Add details about this document"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              minHeight: "80px",
              fontFamily: "inherit",
              padding: "8px 12px",
            }}
          />
        </label>

        <label className="label">
          Select File
          <input
            className="input"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "📤 Upload Document"}
        </button>
      </div>
    </form>
  );
}
