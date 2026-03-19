import { useEffect, useState } from "react";

import { api } from "../lib/api";
import { AdvancedFilters } from "../components/AdvancedFilters";
import { DocumentUpload } from "../components/DocumentUpload";
import { ApprovalWorkflow } from "../components/ApprovalWorkflow";
import { DocumentsList } from "../components/DocumentsList";

const STATUS_OPTIONS = [
  { value: "rnd", label: "R&D" },
  { value: "approval", label: "Approval" },
  { value: "production", label: "Production" },
  { value: "shipment", label: "Shipment" },
  { value: "closed", label: "Closed" },
];

const APPROVAL_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [create, setCreate] = useState({
    name: "",
    description: "",
    status: "rnd",
    customer: "",
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [filters, setFilters] = useState({});
  const [createSuccess, setCreateSuccess] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  async function load(filterParams = {}) {
    setLoading(true);
    setError("");
    try {
      const params = {
        ...filterParams,
      };
      const res = await api.get("/api/projects/", { params });
      setProjects(res.data);

      // Update selected project if it exists in the new list
      if (selectedProject) {
        const updated = res.data.find((p) => p.id === selectedProject.id);
        if (updated) {
          setSelectedProject(updated);
        }
      }

      // Trigger document list refresh
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setError(
        "Failed to load projects: " +
          (err?.response?.data?.detail || err?.message || "Unknown error"),
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
    setCreateSuccess("");

    if (!create.name.trim()) {
      setError("❌ Project name is required");
      return;
    }

    try {
      const payload = {
        name: create.name,
        description: create.description,
        status: create.status,
      };
      if (create.customer) payload.customer = Number(create.customer);

      const res = await api.post("/api/projects/", payload);
      setCreate({ name: "", description: "", status: "rnd", customer: "" });
      setCreateSuccess(`✅ Project "${res.data.name}" created successfully!`);

      // Refresh the projects list
      setTimeout(() => {
        load(filters);
        setCreateSuccess("");
      }, 1000);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.name?.[0] ||
        err?.response?.data?.customer?.[0] ||
        JSON.stringify(err?.response?.data || err?.message || "Create failed");
      setError("❌ Failed to create project: " + errorMsg);
    }
  }

  function handleFilter(newFilters) {
    setFilters(newFilters);
    load(newFilters);
  }

  function handleToggleProject(project) {
    setSelectedProject(selectedProject?.id === project.id ? null : project);
  }

  const getApprovalBadge = (status) => {
    const badges = {
      pending: "⏳",
      approved: "✅",
      rejected: "❌",
    };
    return badges[status] || "❓";
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1 className="h1">Projects</h1>
          <p className="muted">
            Manage projects with approval workflow and documents
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => load(filters)}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {error ? <div className="alert">{error}</div> : null}
      {createSuccess ? (
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
          {createSuccess}
        </div>
      ) : null}

      <AdvancedFilters onFilter={handleFilter} filters={filters} />

      <div className="card">
        <h2 className="h2">✨ Create Project</h2>
        <form onSubmit={onCreate} className="form">
          <div className="grid2">
            <label className="label">
              Project name
              <input
                className="input"
                placeholder="Enter project name"
                value={create.name}
                onChange={(e) =>
                  setCreate((s) => ({ ...s, name: e.target.value }))
                }
                required
              />
            </label>
            <label className="label">
              Status
              <select
                className="input"
                value={create.status}
                onChange={(e) =>
                  setCreate((s) => ({ ...s, status: e.target.value }))
                }
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="label">
            Description
            <textarea
              className="input"
              placeholder="Project description"
              value={create.description}
              onChange={(e) =>
                setCreate((s) => ({ ...s, description: e.target.value }))
              }
              style={{
                minHeight: "80px",
                fontFamily: "inherit",
                padding: "8px 12px",
              }}
            />
          </label>
          <button className="btn">✓ Create Project</button>
        </form>
      </div>

      <div className="card">
        <h2 className="h2">📊 Projects List ({projects.length})</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Customer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.description && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--muted)",
                          marginTop: "4px",
                        }}
                      >
                        {p.description.substring(0, 50)}...
                      </div>
                    )}
                  </td>
                  <td>{p.status}</td>
                  <td>
                    {getApprovalBadge(p.approval_status)} {p.approval_status}
                  </td>
                  <td>{p.customer_username || "-"}</td>
                  <td>
                    <button
                      className="btn"
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        height: "auto",
                        background:
                          selectedProject?.id === p.id
                            ? "rgba(96, 165, 250, 0.3)"
                            : undefined,
                      }}
                      onClick={() => handleToggleProject(p)}
                    >
                      {selectedProject?.id === p.id ? "▼ Hide" : "▶ View"}
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="muted">
                    No projects found
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProject && (
        <div className="stack">
          <div className="card">
            <h2 className="h2">📋 Project Details: {selectedProject.name}</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--muted)",
                    margin: "0 0 4px",
                  }}
                >
                  Status
                </p>
                <p style={{ margin: "0", fontWeight: "600" }}>
                  {selectedProject.status}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--muted)",
                    margin: "0 0 4px",
                  }}
                >
                  Approval Status
                </p>
                <p style={{ margin: "0", fontWeight: "600" }}>
                  {getApprovalBadge(selectedProject.approval_status)}{" "}
                  {selectedProject.approval_status}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--muted)",
                    margin: "0 0 4px",
                  }}
                >
                  Created
                </p>
                <p style={{ margin: "0" }}>
                  {new Date(selectedProject.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--muted)",
                    margin: "0 0 4px",
                  }}
                >
                  Customer
                </p>
                <p style={{ margin: "0" }}>
                  {selectedProject.customer_username || "N/A"}
                </p>
              </div>
            </div>
            {selectedProject.description && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--muted)",
                    margin: "0 0 4px",
                  }}
                >
                  Description
                </p>
                <p style={{ margin: "0" }}>{selectedProject.description}</p>
              </div>
            )}
          </div>

          <DocumentsList
            projectId={selectedProject.id}
            refreshTrigger={refreshKey}
          />
          <DocumentUpload
            projectId={selectedProject.id}
            onDocumentAdded={() => load(filters)}
          />
          <ApprovalWorkflow
            project={selectedProject}
            onApprovalAction={() => load(filters)}
          />
        </div>
      )}
    </div>
  );
}
