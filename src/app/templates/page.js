"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const router = useRouter();

  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [filterLabel, setFilterLabel] = useState("All");

  const [labels, setLabels] = useState([]);
  const [showLabelsDropdown, setShowLabelsDropdown] = useState(false);
  const [showAddLabelModal, setShowAddLabelModal] = useState(false);
  const [newLabelInput, setNewLabelInput] = useState("");
  const [labelSearch, setLabelSearch] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [modalId, setModalId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [modalLabelsSelected, setModalLabelsSelected] = useState([]);

  const [validationError, setValidationError] = useState("");

  // card-level label dropdown open state
  const [openCardLabelId, setOpenCardLabelId] = useState(null);

  // refs for click outside closing
  const labelsDropdownRef = useRef(null);
  const cardLabelRef = useRef(null);

  // load persisted data
  useEffect(() => {
    const saved = localStorage.getItem("templates");
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch {
        setTemplates([]);
      }
    }

    const savedLabels = localStorage.getItem("labels");
    if (savedLabels) {
      try {
        setLabels(JSON.parse(savedLabels));
      } catch {
        setLabels([]);
      }
    }
  }, []);

  const saveTemplatesToStorage = (updated) => {
    localStorage.setItem("templates", JSON.stringify(updated));
    setTemplates(updated);
  };

  const saveLabelsToStorage = (updated) => {
    localStorage.setItem("labels", JSON.stringify(updated));
    setLabels(updated);
  };

  // label helpers
  const addLabel = (labelName) => {
    const trimmed = String(labelName || "").trim();
    if (!trimmed) return false;
    if (labels.includes(trimmed)) return false;
    const updated = [trimmed, ...labels];
    saveLabelsToStorage(updated);
    return true;
  };

  const removeLabelFromStore = (labelName) => {
    const updated = labels.filter((l) => l !== labelName);
    saveLabelsToStorage(updated);

    // remove from templates too
    const updatedTemplates = templates.map((t) =>
      Array.isArray(t.labels) && t.labels.includes(labelName)
        ? { ...t, labels: t.labels.filter((l) => l !== labelName) }
        : t
    );
    saveTemplatesToStorage(updatedTemplates);
  };

  // template flows
  const openAddModal = () => {
    setModalId(null);
    setModalTitle("");
    setModalDescription("");
    setModalLabelsSelected([]);
    setValidationError("");
    setShowAddModal(true);
  };

  const openEditModal = (t) => {
    setModalId(t.id);
    setModalTitle(t.title || "");
    setModalDescription(t.description || "");
    setModalLabelsSelected(Array.isArray(t.labels) ? [...t.labels] : []);
    setValidationError("");
    setShowEditModal(true);
  };

  const validateFields = () => {
    if (!modalTitle.trim() || !modalDescription.trim()) {
      setValidationError("⚠ Please fill all required fields.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const saveNewTemplate = () => {
    if (!validateFields()) return;
    const newTemplate = {
      id: Date.now().toString(),
      title: modalTitle,
      description: modalDescription,
      labels: modalLabelsSelected.length ? [...modalLabelsSelected] : [],
    };
    saveTemplatesToStorage([newTemplate, ...templates]);
    setShowAddModal(false);
  };

  const saveEditedTemplate = () => {
    if (!validateFields()) return;
    const updated = templates.map((t) =>
      t.id === modalId
        ? { ...t, title: modalTitle, description: modalDescription, labels: modalLabelsSelected }
        : t
    );
    saveTemplatesToStorage(updated);
    setShowEditModal(false);
  };

  const deleteCard = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    saveTemplatesToStorage(templates.filter((t) => t.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const useTemplate = (text) => {
    localStorage.setItem("dashboardDescription", text);
    router.push("/");
  };

  // search + label filter
  const filtered = templates.filter((t) => {
    const searchMatch =
      (t.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(search.toLowerCase());
    const labelMatch = filterLabel === "All" ? true : Array.isArray(t.labels) && t.labels.includes(filterLabel);
    return searchMatch && labelMatch;
  });

  // auto-open "make template" flow
  useEffect(() => {
    const desc = localStorage.getItem("makeTemplateDescription");
    if (desc) {
      setModalId(null);
      setModalTitle("");
      setModalDescription(desc);
      setModalLabelsSelected([]);
      setValidationError("");
      setShowAddModal(true);
      localStorage.removeItem("makeTemplateDescription");
    }
  }, []);

  // card-level label dropdown
  const toggleCardLabelDropdown = (cardId) => {
    // when opening a card dropdown, close templates dropdown
    setShowLabelsDropdown(false);
    setOpenCardLabelId((prev) => (prev === cardId ? null : cardId));
  };

  const addLabelToCard = (cardId, labelName) => {
    if (!labels.includes(labelName)) return;
    const updated = templates.map((t) =>
      t.id === cardId
        ? {
            ...t,
            labels: Array.isArray(t.labels)
              ? t.labels.includes(labelName)
                ? t.labels
                : [...t.labels, labelName]
              : [labelName],
          }
        : t
    );
    saveTemplatesToStorage(updated);
    setOpenCardLabelId(null);
  };

  const labelsAvailableForCard = (card) => {
    const used = Array.isArray(card.labels) ? card.labels : [];
    return labels.filter((l) => !used.includes(l));
  };

  // click outside to close dropdowns: central handler
  useEffect(() => {
    const onDocClick = (e) => {
      if (labelsDropdownRef.current && !labelsDropdownRef.current.contains(e.target)) {
        setShowLabelsDropdown(false);
      }
      // cardLabelRef is shared but we only close card dropdown when clicking outside any open card dropdown
      // so if click is not inside any element with data-role="card-label-area", close card dropdown
      const cardArea = document.querySelector('[data-role="card-label-area"]');
      if (openCardLabelId && !e.target.closest('[data-card-label-id]')) {
        setOpenCardLabelId(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openCardLabelId]);

  // filtered labels for the templates dropdown search
  const filteredLabels = labels
    .filter((lab) => typeof lab === "string")
    .filter((lab) => lab.toLowerCase().includes(labelSearch.toLowerCase()));

  // --- Component render ---
  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ marginBottom: 20 }}>Templates</h1>

      {/* top controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd", width: 260 }}
        />

        {/* Labels dropdown (templates page) */}
        <div style={{ position: "relative" }} ref={labelsDropdownRef}>
          <button
            onClick={() => {
              setOpenCardLabelId(null);
              setShowLabelsDropdown((s) => !s);
            }}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            Labels ▼
          </button>

          {showLabelsDropdown && (
            <div
              style={{
                position: "absolute",
                top: 48,
                left: 0,
                width: 260,
                background: "white",
                border: "1px solid #ddd",
                borderRadius: 10,
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                padding: 10,
                zIndex: 300,
                maxHeight: 320,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                value={labelSearch}
                onChange={(e) => setLabelSearch(e.target.value)}
                placeholder="Search labels..."
                style={{ width: "100%", padding: 8, border: "1px solid #ddd", borderRadius: 8 }}
              />

              <div
                onClick={() => {
                  setFilterLabel("All");
                  setShowLabelsDropdown(false);
                }}
                style={{
                  padding: 8,
                  borderRadius: 6,
                  cursor: "pointer",
                  background: filterLabel === "All" ? "#f3f4f6" : "white",
                }}
              >
                All
              </div>

              <div style={{ overflowY: "auto", maxHeight: 180, paddingRight: 4 }}>
                {filteredLabels.map((lab) => (
                  <div
                    key={lab}
                    style={{
                      padding: 8,
                      marginTop: 6,
                      borderRadius: 6,
                      cursor: "pointer",
                      background: filterLabel === lab ? "#f3f4f6" : "white",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      onClick={() => {
                        setFilterLabel(lab);
                        setShowLabelsDropdown(false);
                      }}
                      style={{ flex: 1 }}
                    >
                      {lab}
                    </div>

                    {/* remove icon inside the templates dropdown (per your request) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // confirm removal quickly
                        if (confirm(`Remove label "${lab}" from store and all templates?`)) {
                          removeLabelFromStore(lab);
                        }
                      }}
                      title="Remove label"
                      style={{
                        marginLeft: 8,
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowAddLabelModal(true);
                  setShowLabelsDropdown(false);
                  setNewLabelInput("");
                }}
                style={{
                  width: "100%",
                  marginTop: 6,
                  padding: 8,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                + Add new label
              </button>
            </div>
          )}
        </div>

        <button
          onClick={openAddModal}
          style={{
            marginLeft: "auto",
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "#10b981",
            color: "white",
            cursor: "pointer",
          }}
        >
          + Add Template
        </button>
      </div>

      {/* card grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
        {filtered.map((t) => (
          <div
            key={t.id}
            style={{
              background: "white",
              padding: 20,
              borderRadius: 14,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              position: "relative",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.08)";
            }}
            onClick={(e) => {
              const btn = e.target.dataset.btn;
              const role = e.target.dataset.role;
              if (btn === "use" || btn === "delete" || role === "card-label" || role === "card-label-item") return;
              openEditModal(t);
            }}
          >
            {/* label chips (top-right) */}
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                // ensure chip area doesn't overlap title (adds spacing)
                maxWidth: 200,
              }}
            >
              {(Array.isArray(t.labels) ? t.labels : []).map((lab) => (
                <div
                  key={lab}
                  style={{
                    background: "#f1f5f9",
                    padding: "4px 8px",
                    borderRadius: 999,
                    fontSize: 12,
                    color: "#0f172a",
                    maxWidth: 120,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={lab}
                >
                  {lab}
                </div>
              ))}
            </div>

            {/* spacing to avoid overlap with title */}
            <div style={{ height: (t.labels?.length || 0) > 0 ? 34 : 6 }} />

            {/* title + small + button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{t.title || "Untitled"}</div>

              {/* card label area - note data attributes used by document click handler */}
              <div data-card-label-id={t.id} style={{ position: "relative" }} data-role="card-label-area" ref={cardLabelRef}>
                <button
                  data-role="card-label"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    toggleCardLabelDropdown(t.id);
                  }}
                  title="Add label"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    background: "white",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: 18,
                    color: "#374151",
                  }}
                >
                  +
                </button>

                {/* small dropdown for card labels (reduced size + scrollbar) */}
                {openCardLabelId === t.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: 40,
                      right: 0,
                      width: 160, // reduced width as requested
                      maxHeight: 110,
                      overflowY: "auto", // scrollbar
                      background: "white",
                      border: "1px solid #ddd",
                      borderRadius: 10,
                      padding: 8,
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      zIndex: 400,
                    }}
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>Add label</div>

                    {labelsAvailableForCard(t).length > 0 ? (
                      labelsAvailableForCard(t).map((lab) => (
                        <div
                          key={lab}
                          data-role="card-label-item"
                          onClick={() => addLabelToCard(t.id, lab)}
                          style={{
                            padding: "6px 8px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                        >
                          {lab}
                        </div>
                      ))
                    ) : (
                      <div style={{ color: "#6b7280", padding: 6 }}>No labels available</div>
                    )}

                    <div style={{ height: 6 }} />
                    <button
                      onClick={() => {
                        setShowAddLabelModal(true);
                        setOpenCardLabelId(null);
                        setNewLabelInput("");
                      }}
                      style={{
                        width: "100%",
                        padding: 8,
                        borderRadius: 8,
                        border: "1px solid #ddd",
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      + Add label
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* description */}
            <div style={{ marginTop: 10, maxHeight: 64, overflow: "hidden", color: "#374151", fontSize: 14 }}>
              {t.description || ""}
            </div>

            {/* actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <button
                data-btn="use"
                onClick={(ev) => {
                  ev.stopPropagation();
                  useTemplate(t.description || "");
                }}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: "#6b46c1",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Use
              </button>

              <button
                data-btn="delete"
                onClick={(ev) => {
                  ev.stopPropagation();
                  deleteCard(t.id);
                }}
                style={{
                  flex: 1,
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "none",
                  background: "#ef4444",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Template Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.15)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 600,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 520,
              background: "white",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: 12 }}>Add Template</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontWeight: 600 }}>Job Title</label>
              <input value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd", width: "100%" }} />

              <label style={{ fontWeight: 600 }}>Description</label>
              <textarea value={modalDescription} onChange={(e) => setModalDescription(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd", width: "100%", minHeight: 140 }} />

              {validationError && <div style={{ color: "#dc2626" }}>{validationError}</div>}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={saveNewTemplate} style={{ flex: 1, padding: 12, borderRadius: 8, background: "#10b981", color: "white", border: "none" }}>
                  Save
                </button>
                <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: 12, borderRadius: 8, background: "#94a3b8", color: "white", border: "none" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.15)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 600,
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 520,
              background: "white",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: 12 }}>Edit Template</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontWeight: 600 }}>Job Title</label>
              <input value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd", width: "100%" }} />

              <label style={{ fontWeight: 600 }}>Labels (remove only)</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {Array.isArray(modalLabelsSelected) && modalLabelsSelected.length === 0 && <div style={{ color: "#6b7280" }}>No labels set</div>}
                {modalLabelsSelected.map((lab) => (
                  <div key={lab} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f1f5f9", padding: "6px 10px", borderRadius: 999 }}>
                    <span>{lab}</span>
                    <button onClick={() => setModalLabelsSelected((prev) => prev.filter((p) => p !== lab))} style={{ border: "none", background: "#ef4444", color: "white", padding: "4px 8px", borderRadius: 999, cursor: "pointer" }}>
                      x
                    </button>
                  </div>
                ))}
              </div>

              <label style={{ fontWeight: 600 }}>Description</label>
              <textarea value={modalDescription} onChange={(e) => setModalDescription(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd", width: "100%", minHeight: 140 }} />

              {validationError && <div style={{ color: "#dc2626" }}>{validationError}</div>}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={saveEditedTemplate} style={{ flex: 1, padding: 12, borderRadius: 8, background: "#3b82f6", color: "white", border: "none" }}>
                  Save
                </button>
                <button onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: 12, borderRadius: 8, background: "#94a3b8", color: "white", border: "none" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.15)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 700,
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ width: 380, background: "white", padding: 22, borderRadius: 12, textAlign: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}>
            <h3>Are you sure?</h3>
            <p style={{ color: "#555" }}>Do you really want to delete this template?</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={confirmDelete} style={{ flex: 1, padding: 10, background: "#ef4444", color: "white", borderRadius: 10, border: "none" }}>
                Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: 10, background: "#94a3b8", color: "white", borderRadius: 10, border: "none" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Label Modal */}
      {showAddLabelModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.15)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 900,
          }}
          onClick={() => setShowAddLabelModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: 420, background: "white", padding: 20, borderRadius: 12, boxShadow: "0 12px 30px rgba(0,0,0,0.12)" }}
          >
            <h3 style={{ marginBottom: 8 }}>Add Label</h3>
            <input value={newLabelInput} onChange={(e) => setNewLabelInput(e.target.value)} placeholder="Label name (e.g. Backend)" style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  const ok = addLabel(newLabelInput);
                  if (ok) {
                    setNewLabelInput("");
                    setShowAddLabelModal(false);
                  } else setNewLabelInput((v) => v.trim());
                }}
                style={{ flex: 1, padding: 10, borderRadius: 8, background: "#10b981", color: "white", border: "none" }}
              >
                Save
              </button>
              <button onClick={() => setShowAddLabelModal(false)} style={{ flex: 1, padding: 10, borderRadius: 8, background: "#94a3b8", color: "white", border: "none" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

































