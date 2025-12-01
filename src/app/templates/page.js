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

  const [openCardLabelId, setOpenCardLabelId] = useState(null);

  // ⭐ NEW — label deletion confirmation state
  const [labelToDelete, setLabelToDelete] = useState(null);

  const labelsDropdownRef = useRef(null);
  const cardLabelRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("templates");
    if (saved) setTemplates(JSON.parse(saved) || []);

    const savedLabels = localStorage.getItem("labels");
    if (savedLabels) setLabels(JSON.parse(savedLabels) || []);
  }, []);

  const saveTemplatesToStorage = (updated) => {
    localStorage.setItem("templates", JSON.stringify(updated));
    setTemplates(updated);
  };

  const saveLabelsToStorage = (updated) => {
    localStorage.setItem("labels", JSON.stringify(updated));
    setLabels(updated);
  };

  const addLabel = (labelName) => {
    const trimmed = (labelName || "").trim();
    if (!trimmed || labels.includes(trimmed)) return false;
    const updated = [trimmed, ...labels];
    saveLabelsToStorage(updated);
    return true;
  };

  const removeLabelFromStore = (labelName) => {
    const updated = labels.filter((l) => l !== labelName);
    saveLabelsToStorage(updated);

    const updatedTemplates = templates.map((t) =>
      Array.isArray(t.labels) && t.labels.includes(labelName)
        ? { ...t, labels: t.labels.filter((l) => l !== labelName) }
        : t
    );
    saveTemplatesToStorage(updatedTemplates);
  };

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
    setModalLabelsSelected([...t.labels] || []);
    setValidationError("");
    setShowEditModal(true);
  };

  const validateFields = () => {
    if (!modalTitle.trim() || !modalDescription.trim()) {
      setValidationError("⚠ Please fill all required fields.");
      return false;
    }
    return true;
  };

  const saveNewTemplate = () => {
    if (!validateFields()) return;
    const newTemplate = {
      id: Date.now().toString(),
      title: modalTitle,
      description: modalDescription,
      labels: [...modalLabelsSelected],
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
  };

  const useTemplate = (text) => {
    localStorage.setItem("dashboardDescription", text);
    router.push("/");
  };

  const filtered = templates.filter((t) => {
    const s = search.toLowerCase();
    const match =
      t.title?.toLowerCase().includes(s) ||
      t.description?.toLowerCase().includes(s);
    const labelMatch = filterLabel === "All" || t.labels?.includes(filterLabel);
    return match && labelMatch;
  });

  useEffect(() => {
    const d = localStorage.getItem("makeTemplateDescription");
    if (d) {
      setModalDescription(d);
      setShowAddModal(true);
      localStorage.removeItem("makeTemplateDescription");
    }
  }, []);

  const toggleCardLabelDropdown = (id) => {
    setShowLabelsDropdown(false);
    setOpenCardLabelId((prev) => (prev === id ? null : id));
  };

  const addLabelToCard = (cardId, labelName) => {
    const updated = templates.map((t) =>
      t.id === cardId
        ? {
            ...t,
            labels: t.labels?.includes(labelName)
              ? t.labels
              : [...(t.labels || []), labelName],
          }
        : t
    );

    saveTemplatesToStorage(updated);
    setOpenCardLabelId(null);
  };

  const labelsAvailableForCard = (card) =>
    labels.filter((l) => !card.labels?.includes(l));

  useEffect(() => {
    const handler = (e) => {
      if (labelsDropdownRef.current && !labelsDropdownRef.current.contains(e.target))
        setShowLabelsDropdown(false);

      if (!e.target.closest("[data-card-label-id]")) setOpenCardLabelId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredLabels = labels.filter((lab) =>
    lab.toLowerCase().includes(labelSearch.toLowerCase())
  );

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ marginBottom: 20 }}>Templates</h1>

      {/* === TOP BAR === */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
            width: 260,
          }}
        />

        {/* LABELS DROPDOWN */}
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
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />

              {/* ALL FILTER */}
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

              {/* LABEL LIST */}
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

                    {/* ⭐ LABEL DELETE BUTTON → Opens modal */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLabelToDelete(lab); // OPEN CUSTOM MODAL
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

              {/* ADD NEW LABEL BUTTON */}
              <button
                onClick={() => {
                  setShowAddLabelModal(true);
                  setShowLabelsDropdown(false);
                  setNewLabelInput("");
                }}
                style={{
                  width: "100%",
                  padding: 8,
                  marginTop: 6,
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
            background: "#10b981",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          + Add Template
        </button>
      </div>

      {/* === CARD GRID === */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: 20,
        }}
      >
        {filtered.map((t) => (
          <div
            key={t.id}
            style={{
              background: "white",
              padding: 20,
              borderRadius: 14,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              position: "relative",
              transition: "transform 0.18s, box-shadow 0.18s",
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
              if (btn === "use" || btn === "delete" || role === "card-label" || role === "card-label-item")
                return;
              openEditModal(t);
            }}
          >
            {/* LABEL CHIPS */}
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                maxWidth: 200,
              }}
            >
              {(t.labels || []).map((lab) => (
                <div
                  key={lab}
                  style={{
                    background: "#f1f5f9",
                    padding: "4px 8px",
                    borderRadius: 999,
                    fontSize: 12,
                    maxWidth: 120,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  title={lab}
                >
                  {lab}
                </div>
              ))}
            </div>

            <div style={{ height: t.labels?.length ? 34 : 6 }} />

            {/* TITLE + + BUTTON */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{t.title}</strong>

              <div data-card-label-id={t.id} style={{ position: "relative" }} ref={cardLabelRef}>
                <button
                  data-role="card-label"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    toggleCardLabelDropdown(t.id);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                    fontSize: 18,
                  }}
                >
                  +
                </button>

                {/* SMALLER DROPDOWN WITH SCROLL */}
                {openCardLabelId === t.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: 40,
                      right: 0,
                      width: 150,
                      maxHeight: 110,
                      overflowY: "auto",
                      background: "white",
                      border: "1px solid #ddd",
                      borderRadius: 10,
                      padding: 8,
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      zIndex: 999,
                    }}
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>Add label</div>

                    {labelsAvailableForCard(t).length > 0 ? (
                      labelsAvailableForCard(t).map((lab) => (
                        <div
                          key={lab}
                          data-role="card-label-item"
                          onClick={() => addLabelToCard(t.id, lab)}
                          style={{
                            padding: "6px 8px",
                            cursor: "pointer",
                            borderRadius: 6,
                          }}
                        >
                          {lab}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: 6, color: "#999" }}>No labels</div>
                    )}

                    <button
                      onClick={() => {
                        setShowAddLabelModal(true);
                        setOpenCardLabelId(null);
                      }}
                      style={{
                        width: "100%",
                        marginTop: 6,
                        padding: 6,
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        cursor: "pointer",
                        background: "white",
                      }}
                    >
                      + Add label
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <p style={{ marginTop: 10, maxHeight: 70, overflow: "hidden" }}>{t.description}</p>

            {/* BUTTONS */}
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button
                data-btn="use"
                onClick={(ev) => {
                  ev.stopPropagation();
                  useTemplate(t.description);
                }}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  background: "#6b46c1",
                  border: "none",
                  color: "white",
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
                  padding: 10,
                  borderRadius: 10,
                  background: "#ef4444",
                  border: "none",
                  color: "white",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== ADD TEMPLATE MODAL ===================== */}
      {showAddModal && (
        <div
          style={modalOverlay}
          onClick={() => setShowAddModal(false)}
        >
          <div style={modalContainer} onClick={(e) => e.stopPropagation()}>
            <h2 style={modalTitleStyle}>Add Template</h2>

            <label>Job Title</label>
            <input
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              style={inputStyle}
            />

            <label>Description</label>
            <textarea
              value={modalDescription}
              onChange={(e) => setModalDescription(e.target.value)}
              style={textareaStyle}
            />

            {validationError && <p style={{ color: "red" }}>{validationError}</p>}

            <div style={modalButtonRow}>
              <button style={saveBtn} onClick={saveNewTemplate}>
                Save
              </button>
              <button style={cancelBtn} onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== EDIT TEMPLATE MODAL ===================== */}
      {showEditModal && (
        <div
          style={modalOverlay}
          onClick={() => setShowEditModal(false)}
        >
          <div style={modalContainer} onClick={(e) => e.stopPropagation()}>
            <h2 style={modalTitleStyle}>Edit Template</h2>

            <label>Job Title</label>
            <input
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              style={inputStyle}
            />

            <label>Labels (remove only)</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {modalLabelsSelected.map((lab) => (
                <div
                  key={lab}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#f1f5f9",
                    padding: "6px 10px",
                    borderRadius: 999,
                  }}
                >
                  {lab}
                  <button
                    onClick={() => setModalLabelsSelected((prev) => prev.filter((p) => p !== lab))}
                    style={{
                      background: "#ef4444",
                      padding: "4px 8px",
                      border: "none",
                      borderRadius: 999,
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>

            <label>Description</label>
            <textarea
              value={modalDescription}
              onChange={(e) => setModalDescription(e.target.value)}
              style={textareaStyle}
            />

            {validationError && <p style={{ color: "red" }}>{validationError}</p>}

            <div style={modalButtonRow}>
              <button style={saveBtn} onClick={saveEditedTemplate}>
                Save
              </button>
              <button style={cancelBtn} onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== DELETE TEMPLATE CONFIRM ===================== */}
      {showDeleteModal && (
        <div
          style={modalOverlay}
          onClick={() => setShowDeleteModal(false)}
        >
          <div style={deleteModalContainer} onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure?</h3>
            <p>Do you really want to delete this template?</p>

            <div style={modalButtonRow}>
              <button style={deleteBtn} onClick={confirmDelete}>
                Delete
              </button>
              <button style={cancelBtn} onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ NEW — DELETE LABEL CONFIRM MODAL */}
      {labelToDelete && (
        <div style={modalOverlay} onClick={() => setLabelToDelete(null)}>
          <div style={deleteModalContainer} onClick={(e) => e.stopPropagation()}>
            <h3>Delete Label?</h3>
            <p>Are you sure you want to delete label "{labelToDelete}" everywhere?</p>

            <div style={modalButtonRow}>
              <button
                style={deleteBtn}
                onClick={() => {
                  removeLabelFromStore(labelToDelete);
                  setLabelToDelete(null);
                }}
              >
                Delete
              </button>

              <button style={cancelBtn} onClick={() => setLabelToDelete(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD LABEL MODAL */}
      {showAddLabelModal && (
        <div
          style={modalOverlay}
          onClick={() => setShowAddLabelModal(false)}
        >
          <div style={modalContainer} onClick={(e) => e.stopPropagation()}>
            <h3>Add Label</h3>

            <input
              value={newLabelInput}
              onChange={(e) => setNewLabelInput(e.target.value)}
              placeholder="Label name..."
              style={inputStyle}
            />

            <div style={modalButtonRow}>
              <button
                style={saveBtn}
                onClick={() => {
                  if (addLabel(newLabelInput)) {
                    setShowAddLabelModal(false);
                    setNewLabelInput("");
                  }
                }}
              >
                Save
              </button>
              <button style={cancelBtn} onClick={() => setShowAddLabelModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* === SHARED MODAL STYLES === */

const modalOverlay = {
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
};

const modalContainer = {
  width: 520,
  background: "white",
  padding: 24,
  borderRadius: 12,
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
};

const deleteModalContainer = {
  width: 380,
  background: "white",
  padding: 22,
  borderRadius: 12,
  textAlign: "center",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
};

const inputStyle = {
  padding: 10,
  width: "100%",
  borderRadius: 8,
  border: "1px solid #ddd",
  marginBottom: 12,
};

const textareaStyle = {
  padding: 10,
  width: "100%",
  borderRadius: 8,
  border: "1px solid #ddd",
  minHeight: 140,
};

const modalTitleStyle = {
  textAlign: "center",
  marginBottom: 12,
};

const modalButtonRow = {
  display: "flex",
  gap: 12,
  marginTop: 12,
};

const saveBtn = {
  flex: 1,
  padding: 12,
  background: "#10b981",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const cancelBtn = {
  flex: 1,
  padding: 12,
  background: "#94a3b8",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const deleteBtn = {
  flex: 1,
  padding: 12,
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
