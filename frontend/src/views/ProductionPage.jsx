import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function ProductionPage() {
  const [records, setRecords] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [create, setCreate] = useState({
    project: "",
    output: "",
    defects: "",
    shift: "day",
  });
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [prec, proj] = await Promise.all([
        api.get("/api/production/"),
        api.get("/api/projects/"),
      ]);
      setRecords(prec.data);
      setProjects(proj.data);
    } catch (err) {
      setError(
        "Failed to load production data: " + (err?.message || "Unknown error"),
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

    if (!create.project || !create.output) {
      setError("❌ Project and output are required");
      return;
    }

    try {
      const payload = {
        project: Number(create.project),
        output: Number(create.output),
        defects: Number(create.defects) || 0,
        shift: create.shift,
      };
      const res = await api.post("/api/production/", payload);
      setSuccess(
        `✅ Production record created: ${res.data.output} output, ${res.data.defects} defects`,
      );
      setCreate({ project: "", output: "", defects: "", shift: "day" });
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

  const stats = {
    totalOutput: records.reduce((acc, r) => acc + (r.output || 0), 0),
    totalDefects: records.reduce((acc, r) => acc + (r.defects || 0), 0),
    avgDefectRate:
      records.length > 0
        ? (
            (records.reduce((acc, r) => acc + (r.defects || 0), 0) /
              records.reduce((acc, r) => acc + (r.output || 0), 0)) *
            100
          ).toFixed(2)
        : 0,
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1 className="h1">Production</h1>
          <p className="muted">
            Track production output, defects, and shift records
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
          <div className="kpi-label">Total Output</div>
          <div className="kpi-value">{stats.totalOutput}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Total Defects</div>
          <div className="kpi-value">{stats.totalDefects}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Defect Rate</div>
          <div className="kpi-value">{stats.avgDefectRate}%</div>
        </div>
      </div>

      <div className="card">
        <h2 className="h2">📝 Record Production</h2>
        <form onSubmit={onCreate} className="form">
          <div className="grid2">
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
              Shift
              <select
                className="input"
                value={create.shift}
                onChange={(e) =>
                  setCreate((s) => ({ ...s, shift: e.target.value }))
                }
              >
                <option value="day">Day</option>
                <option value="night">Night</option>
              </select>
            </label>
          </div>
          <div className="grid2">
            <label className="label">
              Output (units)
              <input
                className="input"
                type="number"
                placeholder="e.g., 100"
                value={create.output}
                onChange={(e) =>
                  setCreate((s) => ({ ...s, output: e.target.value }))
                }
                required
              />
            </label>
            <label className="label">
              Defects
              <input
                className="input"
                type="number"
                placeholder="e.g., 5"
                value={create.defects}
                onChange={(e) =>
                  setCreate((s) => ({ ...s, defects: e.target.value }))
                }
              />
            </label>
          </div>
          <button className="btn">✓ Record Production</button>
        </form>
      </div>

      <div className="card">
        <h2 className="h2">📊 Production Records ({records.length})</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Output</th>
                <th>Defects</th>
                <th>Shift</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">
                    No production records yet
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>
                        {r.project_name || `Project ${r.project}`}
                      </strong>
                    </td>
                    <td>{r.output}</td>
                    <td
                      style={{ color: r.defects > 0 ? "#dc2626" : "inherit" }}
                    >
                      {r.defects}
                    </td>
                    <td>{r.shift === "day" ? "🌍 Day" : "🌙 Night"}</td>
                    <td>{new Date(r.recorded_at).toLocaleDateString()}</td>
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
