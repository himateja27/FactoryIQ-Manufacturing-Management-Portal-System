import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";

export function InventoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [createItem, setCreateItem] = useState({
    item_name: "",
    quantity: "",
    location: "",
  });
  const [createShipment, setCreateShipment] = useState({
    tracking_id: "",
    status: "pending",
    eta: "",
  });
  const [success, setSuccess] = useState("");
  const role = user?.role;
  const canEdit = role === "admin" || role === "engineer"; // admin & engineering can modify

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [inv, ship] = await Promise.all([
        api.get("/api/supplychain/inventory/"),
        api.get("/api/supplychain/shipments/"),
      ]);
      setItems(inv.data);
      setShipments(ship.data);
    } catch (err) {
      setError(
        "Failed to load inventory data: " + (err?.message || "Unknown error"),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createNewItem(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!createItem.item_name || !createItem.quantity) {
      setError("❌ Item name and quantity are required");
      return;
    }

    try {
      const payload = {
        item_name: createItem.item_name,
        quantity: Number(createItem.quantity),
        location: createItem.location,
      };
      const res = await api.post("/api/supplychain/inventory/", payload);
      setSuccess(`✅ Inventory item created: ${res.data.item_name}`);
      setCreateItem({ item_name: "", quantity: "", location: "" });
      setTimeout(() => {
        load();
        setSuccess("");
      }, 1000);
    } catch (err) {
      const errorMsg = err?.response?.data?.detail || "Failed to create";
      setError("❌ " + errorMsg);
    }
  }

  async function createNewShipment(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!createShipment.tracking_id) {
      setError("❌ Tracking ID is required");
      return;
    }

    try {
      const payload = {
        tracking_id: createShipment.tracking_id,
        status: createShipment.status,
      };
      if (createShipment.eta) payload.eta = createShipment.eta;

      const res = await api.post("/api/supplychain/shipments/", payload);
      setSuccess(`✅ Shipment created: ${res.data.tracking_id}`);
      setCreateShipment({ tracking_id: "", status: "pending", eta: "" });
      setTimeout(() => {
        load();
        setSuccess("");
      }, 1000);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.tracking_id?.[0] ||
        "Failed to create";
      setError("❌ " + errorMsg);
    }
  }

  async function updateItemQuantity(id, newQuantity) {
    try {
      await api.patch(`/api/supplychain/inventory/${id}/`, {
        quantity: newQuantity,
      });
      setSuccess(`✅ Item quantity updated`);
      setTimeout(() => {
        load();
        setSuccess("");
      }, 1000);
    } catch (err) {
      setError("❌ Failed to update quantity");
    }
  }

  async function updateShipmentStatus(id, newStatus) {
    try {
      await api.patch(`/api/supplychain/shipments/${id}/`, {
        status: newStatus,
      });
      setSuccess(`✅ Shipment status updated to ${newStatus}`);
      setTimeout(() => {
        load();
        setSuccess("");
      }, 1000);
    } catch (err) {
      setError("❌ Failed to update shipment");
    }
  }

  const lowStockItems = items.filter((i) => i.quantity < 10);
  const getStatusBadge = (status) => {
    const badges = {
      pending: "⏳ Pending",
      in_transit: "🚚 In Transit",
      delivered: "✅ Delivered",
      cancelled: "❌ Cancelled",
    };
    return badges[status] || status;
  };

  return (
    <div className="stack">
      <div className="page-head">
        <div>
          <h1 className="h1">Inventory & Supply Chain</h1>
          <p className="muted">Manage inventory items and shipment tracking</p>
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
          <div className="kpi-label">Total Items</div>
          <div className="kpi-value">{items.length}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Low Stock Items</div>
          <div className="kpi-value" style={{ color: "#f59e0b" }}>
            {lowStockItems.length}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Total Shipments</div>
          <div className="kpi-value">{shipments.length}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button
          className="btn"
          onClick={() => setActiveTab("inventory")}
          style={{
            background:
              activeTab === "inventory" ? "var(--primary)" : "transparent",
            border:
              activeTab === "inventory" ? "none" : "1px solid var(--border)",
          }}
        >
          📦 Inventory
        </button>
        <button
          className="btn"
          onClick={() => setActiveTab("shipments")}
          style={{
            background:
              activeTab === "shipments" ? "var(--primary)" : "transparent",
            border:
              activeTab === "shipments" ? "none" : "1px solid var(--border)",
          }}
        >
          🚚 Shipments
        </button>
      </div>

      {activeTab === "inventory" && (
        <>
          {canEdit && (
            <div className="card">
              <h2 className="h2">📦 Add Inventory Item</h2>
              <form onSubmit={createNewItem} className="form">
                <div className="grid2">
                  <label className="label">
                    Item Name
                    <input
                      className="input"
                      type="text"
                      placeholder="e.g., Copper Wire"
                      value={createItem.item_name}
                      onChange={(e) =>
                        setCreateItem((s) => ({
                          ...s,
                          item_name: e.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                  <label className="label">
                    Quantity
                    <input
                      className="input"
                      type="number"
                      placeholder="e.g., 100"
                      value={createItem.quantity}
                      onChange={(e) =>
                        setCreateItem((s) => ({ ...s, quantity: e.target.value }))
                      }
                      required
                    />
                  </label>
                </div>
                <label className="label">
                  Location
                  <input
                    className="input"
                    type="text"
                    placeholder="e.g., Warehouse A - Shelf 5"
                    value={createItem.location}
                    onChange={(e) =>
                      setCreateItem((s) => ({ ...s, location: e.target.value }))
                    }
                  />
                </label>
                <button className="btn">✓ Add Item</button>
              </form>
            </div>
          )}

          <div className="card">
            <h2 className="h2">🏭 Inventory Items ({items.length})</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Location</th>
                    <th>Updated</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="muted">
                        No inventory items yet
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          background:
                            item.quantity < 10
                              ? "rgba(245, 158, 11, 0.1)"
                              : "inherit",
                        }}
                      >
                        <td>
                          <strong>{item.item_name}</strong>
                          {item.quantity < 10 && (
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#f59e0b",
                                marginTop: "4px",
                              }}
                            >
                              ⚠️ Low Stock
                            </div>
                          )}
                        </td>
                        <td>
                          {canEdit ? (
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItemQuantity(item.id, e.target.value)
                              }
                              style={{
                                width: "70px",
                                padding: "4px 8px",
                                fontSize: "12px",
                              }}
                            />
                          ) : (
                            item.quantity
                          )}
                        </td>
                        <td>{item.location || "-"}</td>
                        <td>
                          {new Date(item.updated_at).toLocaleDateString()}
                        </td>
                        <td>
                          {canEdit && (
                            <button
                              className="btn"
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity + 10)
                              }
                              style={{
                                fontSize: "11px",
                                padding: "4px 8px",
                                height: "auto",
                              }}
                            >
                              +10
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "shipments" && (
        <>
          {canEdit && (
            <div className="card">
              <h2 className="h2">🚚 Create Shipment</h2>
              <form onSubmit={createNewShipment} className="form">
                <div className="grid2">
                  <label className="label">
                    Tracking ID
                    <input
                      className="input"
                      type="text"
                      placeholder="e.g., SHIP-2026-0001"
                      value={createShipment.tracking_id}
                      onChange={(e) =>
                        setCreateShipment((s) => ({
                          ...s,
                          tracking_id: e.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                  <label className="label">
                    Status
                    <select
                      className="input"
                      value={createShipment.status}
                      onChange={(e) =>
                        setCreateShipment((s) => ({
                          ...s,
                          status: e.target.value,
                        }))
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </label>
                </div>
                <label className="label">
                  ETA (Estimated Delivery)
                  <input
                    className="input"
                    type="date"
                    value={createShipment.eta}
                    onChange={(e) =>
                      setCreateShipment((s) => ({ ...s, eta: e.target.value }))
                    }
                  />
                </label>
                <button className="btn">✓ Create Shipment</button>
              </form>
            </div>
          )}

          <div className="card">
            <h2 className="h2">📦 Shipments ({shipments.length})</h2>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Status</th>
                    <th>ETA</th>
                    <th>Created</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="muted">
                        No shipments yet
                      </td>
                    </tr>
                  ) : (
                    shipments.map((ship) => (
                      <tr key={ship.id}>
                        <td>
                          <strong>{ship.tracking_id}</strong>
                        </td>
                        <td>{getStatusBadge(ship.status)}</td>
                        <td>
                          {ship.eta
                            ? new Date(ship.eta).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          {new Date(ship.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          {canEdit ? (
                            <select
                              className="input"
                              value={ship.status}
                              onChange={(e) =>
                                updateShipmentStatus(ship.id, e.target.value)
                              }
                              style={{
                                fontSize: "12px",
                                padding: "4px 8px",
                                height: "auto",
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="in_transit">In Transit</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          ) : (
                            getStatusBadge(ship.status)
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
