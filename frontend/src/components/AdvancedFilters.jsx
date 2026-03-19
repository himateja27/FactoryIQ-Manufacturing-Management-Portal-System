import { useState } from "react";

export function AdvancedFilters({ onFilter, filters }) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters || {});

  function handleChange(key, value) {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleApply() {
    onFilter(localFilters);
    setShowFilters(false);
  }

  function handleReset() {
    setLocalFilters({});
    onFilter({});
  }

  return (
    <div className="filter-container">
      <button
        className="btn btn-secondary"
        onClick={() => setShowFilters(!showFilters)}
      >
        🔍 Advanced Filters {showFilters ? "−" : "+"}
      </button>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-grid">
            <label className="label">
              Status
              <select
                className="input"
                value={localFilters.status || ""}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="rnd">R&D</option>
                <option value="approval">Approval</option>
                <option value="production">Production</option>
                <option value="shipment">Shipment</option>
                <option value="closed">Closed</option>
              </select>
            </label>

            <label className="label">
              Approval Status
              <select
                className="input"
                value={localFilters.approval_status || ""}
                onChange={(e) =>
                  handleChange("approval_status", e.target.value)
                }
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>

            <label className="label">
              Start Date
              <input
                className="input"
                type="date"
                value={localFilters.start_date || ""}
                onChange={(e) => handleChange("start_date", e.target.value)}
              />
            </label>

            <label className="label">
              End Date
              <input
                className="input"
                type="date"
                value={localFilters.end_date || ""}
                onChange={(e) => handleChange("end_date", e.target.value)}
              />
            </label>

            <label className="label">
              Search
              <input
                className="input"
                type="text"
                placeholder="Project name or description"
                value={localFilters.search || ""}
                onChange={(e) => handleChange("search", e.target.value)}
              />
            </label>
          </div>

          <div className="filter-actions">
            <button className="btn" onClick={handleApply}>
              ✓ Apply Filters
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              ↻ Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
