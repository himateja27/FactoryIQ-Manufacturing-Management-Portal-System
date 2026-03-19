import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";

export function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [production, setProduction] = useState([]);
  const [ncrs, setNcrs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setError("");
      try {
        const requests = [
          api.get("/api/projects/"),
          api.get("/api/production/"),
        ];

        // Add role-specific API calls
        if (["admin", "quality"].includes(user?.role)) {
          requests.push(api.get("/api/quality/ncrs/"));
        }

        const results = await Promise.all(requests);
        if (!mounted) return;

        setProjects(results[0].data);
        setProduction(results[1].data);
        if (results[2]) {
          setNcrs(results[2].data);
        }
      } catch (e) {
        setError(
          "Failed to load dashboard data: " + (e?.message || "Unknown error"),
        );
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [user?.role]);

  const chartData = useMemo(() => {
    const rows = [...production]
      .slice(0, 14)
      .reverse()
      .map((r) => ({
        day: new Date(r.recorded_at).toLocaleDateString(),
        output: r.output,
        defects: r.defects,
      }));
    return rows;
  }, [production]);

  const projectStats = useMemo(() => {
    return {
      total: projects.length,
      approved: projects.filter((p) => p.approval_status === "approved").length,
      pending: projects.filter((p) => p.approval_status === "pending").length,
      rejected: projects.filter((p) => p.approval_status === "rejected").length,
    };
  }, [projects]);

  const productionStats = useMemo(() => {
    return {
      totalOutput: production.reduce((acc, r) => acc + (r.output || 0), 0),
      totalDefects: production.reduce((acc, r) => acc + (r.defects || 0), 0),
      defectRate:
        production.length > 0
          ? (
              (production.reduce((acc, r) => acc + (r.defects || 0), 0) /
                production.reduce((acc, r) => acc + (r.output || 0), 0)) *
              100
            ).toFixed(2)
          : 0,
    };
  }, [production]);

  const ncrStats = useMemo(() => {
    return {
      open: ncrs.filter((n) => n.status === "open").length,
      investigating: ncrs.filter((n) => n.status === "investigating").length,
      closed: ncrs.filter((n) => n.status === "closed").length,
    };
  }, [ncrs]);

  const getRoleWelcome = () => {
    const welcomes = {
      admin: "Welcome, Admin! Full system access",
      engineer: "Welcome, Engineer! Production oversight",
      quality: "Welcome, Quality Team! Quality management",
      customer: "Welcome, Customer! Project tracking",
    };
    return welcomes[user?.role] || "Welcome to FactoryIQ";
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1 className="h1">Dashboard</h1>
          <p className="muted">{getRoleWelcome()}</p>
        </div>
      </div>

      {error ? <div className="alert">{error}</div> : null}

      {/* Project Stats - visible to all */}
      <div className="card">
        <h2 className="h2">📋 Project Overview</h2>
        <div className="kpis">
          <div className="kpi">
            <div className="kpi-label">Total Projects</div>
            <div className="kpi-value">{projectStats.total}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">✅ Approved</div>
            <div className="kpi-value" style={{ color: "#10b981" }}>
              {projectStats.approved}
            </div>
          </div>
          <div className="kpi">
            <div className="kpi-label">⏳ Pending</div>
            <div className="kpi-value" style={{ color: "#f59e0b" }}>
              {projectStats.pending}
            </div>
          </div>
          <div className="kpi">
            <div className="kpi-label">❌ Rejected</div>
            <div className="kpi-value" style={{ color: "#dc2626" }}>
              {projectStats.rejected}
            </div>
          </div>
        </div>
      </div>

      {/* Production Stats - visible to admin/engineer */}
      {["admin", "engineer"].includes(user?.role) && (
        <>
          <div className="card">
            <h2 className="h2">📊 Production KPIs</h2>
            <div className="kpis">
              <div className="kpi">
                <div className="kpi-label">Total Output</div>
                <div className="kpi-value">{productionStats.totalOutput}</div>
              </div>
              <div className="kpi">
                <div className="kpi-label">Total Defects</div>
                <div className="kpi-value" style={{ color: "#dc2626" }}>
                  {productionStats.totalDefects}
                </div>
              </div>
              <div className="kpi">
                <div className="kpi-label">Defect Rate</div>
                <div className="kpi-value">{productionStats.defectRate}%</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="h2">📈 Output vs Defects (Recent)</h2>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="output"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="defects"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* Quality Stats - visible to admin/quality */}
      {["admin", "quality"].includes(user?.role) && (
        <div className="card">
          <h2 className="h2">🔴 Quality - NCR Status</h2>
          <div className="kpis">
            <div className="kpi">
              <div className="kpi-label">🔴 Open</div>
              <div className="kpi-value" style={{ color: "#dc2626" }}>
                {ncrStats.open}
              </div>
            </div>
            <div className="kpi">
              <div className="kpi-label">🟡 Investigating</div>
              <div className="kpi-value" style={{ color: "#f59e0b" }}>
                {ncrStats.investigating}
              </div>
            </div>
            <div className="kpi">
              <div className="kpi-label">✅ Closed</div>
              <div className="kpi-value" style={{ color: "#10b981" }}>
                {ncrStats.closed}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Info Card */}
      <div className="card">
        <h2 className="h2">👤 Your Access Level</h2>
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
              Role
            </p>
            <p style={{ margin: "0", fontWeight: "600" }}>
              {user?.role?.toUpperCase()}
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
              Username
            </p>
            <p style={{ margin: "0", fontWeight: "600" }}>{user?.username}</p>
          </div>
          <div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--muted)",
                margin: "0 0 4px",
              }}
            >
              Email
            </p>
            <p style={{ margin: "0", fontWeight: "600" }}>{user?.email}</p>
          </div>
          <div>
            <p
              style={{
                fontSize: "12px",
                color: "var(--muted)",
                margin: "0 0 4px",
              }}
            >
              Can View
            </p>
            <p style={{ margin: "0", fontWeight: "600" }}>
              {["admin", "engineer"].includes(user?.role)
                ? "✅ All Data"
                : "🔒 Limited"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
