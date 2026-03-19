import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function QualityPage() {
  const [ncrs, setNcrs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [create, setCreate] = useState({
    project: "",
    defect_type: "",
    root_cause: "",
  });
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [ncr, proj] = await Promise.all([
        api.get("/api/quality/ncrs/"), // correct NCR endpoint
        api.get("/api/projects/"), // all projects (filtered by role on backend)
      ]);
      setNcrs(ncr.data);
      setProjects(proj.data);
    } catch (err) {
      setError(
        "Failed to load quality data: " + (err?.message || "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!create.project || !create.defect_type) {
      setError("❌ Project and defect type are required");
      return;
    }

    try {
      const payload = {
        project: Number(create.project),
        defect_type: create.defect_type,
        root_cause: create.root_cause,
      };
      const res = await api.post("/api/quality/ncrs/", payload);
      setSuccess(`✅ NCR #${res.data.id} created: ${res.data.defect_type}`);
      setCreate({ project: "", defect_type: "", root_cause: "" });
      setTimeout(() => {
        load();
        setSuccess("");
      }, 1000);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.project?.[0] ||
        "Failed to create";
      setError("❌ " + errorMsg);
    }
  }

  async function updateStatus(id, newStatus) {
    try {
      await api.patch(`/api/quality/ncrs/${id}/`, { status: newStatus });
      setSuccess(`✅ NCR #${id} status changed to ${newStatus}`);
      setTimeout(() => {
        load();
        setSuccess("");
      }, 1000);
    } catch (err) {
      setError("❌ Failed to update status");
    }
  }

  const stats = {
    open: ncrs.filter((n) => n.status === "open").length,
    investigating: ncrs.filter((n) => n.status === "investigating").length,
    closed: ncrs.filter((n) => n.status === "closed").length,
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: "🔴 Open",
      investigating: "🟡 Investigating",
      closed: "✅ Closed",
    };
    return badges[status] || status;
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1 className="h1">Quality</h1>
          <p className="muted">
            Manage Non-Conformance Reports (NCR) and defect tracking
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => load()}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {error ? <div className="alert">{error}</div> : null}
      {success ? (
        <div
          style={{
            padding: "12px",
            background: "#dcfce7",
            color: "#166534",
            borderRadius: "6px",
            marginBottom: "16px",
            border: "1px solid #bbf7d0",
          }}
        >
          {success}
        </div>
      ) : null}

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-label">Open NCRs</div>
          <div className="kpi-value" style={{ color: "#dc2626" }}>
            {stats.open}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Investigating</div>
          <div className="kpi-value" style={{ color: "#f59e0b" }}>
            {stats.investigating}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Closed</div>
          <div className="kpi-value" style={{ color: "#10b981" }}>
            {stats.closed}
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="h2">📋 Create NCR</h2>
        <form onSubmit={onCreate} className="form">
          <label className="label">
            Project
            <select
              className="input"
              value={create.project}
              onChange={(e) =>
                setCreate((s) => ({ ...s, project: e.target.value }))
              }
              required
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.status})
                </option>
              ))}
            </select>
          </label>
          <label className="label">
            Defect Type
            <input
              className="input"
              type="text"
              placeholder="e.g., Surface scratches, Dimension out of spec"
              value={create.defect_type}
              onChange={(e) =>
                setCreate((s) => ({ ...s, defect_type: e.target.value }))
              }
              required
            />
          </label>
          <label className="label">
            Root Cause
            <textarea
              className="input"
              placeholder="Describe the root cause analysis"
              value={create.root_cause}
              onChange={(e) =>
                setCreate((s) => ({ ...s, root_cause: e.target.value }))
              }
              style={{
                minHeight: "80px",
                fontFamily: "inherit",
                padding: "8px 12px",
              }}
            />
          </label>
          <button className="btn">✓ Create NCR</button>
        </form>
      </div>

      <div className="card">
        <h2 className="h2">📊 NCRs ({ncrs.length})</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>Defect Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ncrs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="muted">
                    No NCRs yet
                  </td>
                </tr>
              ) : (
                ncrs.map((n) => (
                  <tr key={n.id}>
                    <td>#{n.id}</td>
                    <td>
                      <strong>
                        {n.project_name || `Project ${n.project}`}
                      </strong>
                    </td>
                    <td>{n.defect_type}</td>
                    <td>{getStatusBadge(n.status)}</td>
                    <td>{new Date(n.created_at).toLocaleDateString()}</td>
                    <td>
                      <select
                        className="input"
                        value={n.status}
                        onChange={(e) => updateStatus(n.id, e.target.value)}
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          height: "auto",
                        }}
                      >
                        <option value="open">Open</option>
                        <option value="investigating">Investigating</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
