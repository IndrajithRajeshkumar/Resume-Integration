"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const router = useRouter();

  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showCategories, setShowCategories] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit/Delete tracking
  const [modalId, setModalId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Modal inputs
  const [modalTitle, setModalTitle] = useState("");
  const [modalCategory, setModalCategory] = useState("Technical");
  const [modalDescription, setModalDescription] = useState("");

  // Validation state
  const [validationError, setValidationError] = useState("");

  // Load templates
  useEffect(() => {
    const saved = localStorage.getItem("templates");
    if (saved) setTemplates(JSON.parse(saved));
  }, []);

  const saveToStorage = (updated) => {
    localStorage.setItem("templates", JSON.stringify(updated));
    setTemplates(updated);
  };

  // DELETE POPUP
  const deleteCard = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updated = templates.filter((t) => t.id !== deleteId);
    saveToStorage(updated);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // USE TEMPLATE
  const useTemplate = (text) => {
    localStorage.setItem("dashboardDescription", text);
    router.push("/");
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    setModalId(null);
    setModalTitle("");
    setModalCategory("Technical");
    setModalDescription("");
    setValidationError("");
    setShowAddModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (t) => {
    setModalId(t.id);
    setModalTitle(t.title);
    setModalCategory(t.category);
    setModalDescription(t.description);
    setValidationError("");
    setShowEditModal(true);
  };

  // VALIDATION FUNCTION
  const validateFields = () => {
    if (!modalTitle.trim() || !modalCategory.trim() || !modalDescription.trim()) {
      setValidationError("⚠ Please fill all required fields.");
      return false;
    }
    setValidationError("");
    return true;
  };

  // SAVE NEW TEMPLATE
  const saveNewTemplate = () => {
    if (!validateFields()) return;

    const newTemplate = {
      id: Date.now().toString(),
      title: modalTitle,
      category: modalCategory,
      description: modalDescription,
    };

    saveToStorage([newTemplate, ...templates]);
    setShowAddModal(false);
  };

  // SAVE EDIT
  const saveEditedTemplate = () => {
    if (!validateFields()) return;

    const updated = templates.map((t) =>
      t.id === modalId
        ? {
            ...t,
            title: modalTitle,
            category: modalCategory,
            description: modalDescription,
          }
        : t
    );

    saveToStorage(updated);
    setShowEditModal(false);
  };

  // FILTER
  const filtered = templates.filter((t) => {
    const searchMatch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());

    const categoryMatch = filter === "All" ? true : t.category === filter;

    return searchMatch && categoryMatch;
  });

  // AUTO-OPEN ADD TEMPLATE MODAL (Make Template)
  useEffect(() => {
    const desc = localStorage.getItem("makeTemplateDescription");
    if (desc) {
      setModalId(null);
      setModalTitle("");
      setModalCategory("Technical");
      setModalDescription(desc);
      setValidationError("");
      setShowAddModal(true);

      localStorage.removeItem("makeTemplateDescription");
    }
  }, []);

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ marginBottom: 20 }}>Templates</h1>

      {/* SEARCH + CATEGORIES + ADD */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
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

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowCategories(!showCategories)}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            Categories ▼
          </button>

          {showCategories && (
            <div
              style={{
                position: "absolute",
                top: 45,
                left: 0,
                width: 150,
                background: "white",
                border: "1px solid #ddd",
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 50,
              }}
            >
              {["All", "Technical", "Non-Technical"].map((cat) => (
                <div
                  key={cat}
                  onClick={() => {
                    setFilter(cat);
                    setShowCategories(false);
                  }}
                  style={{
                    padding: 10,
                    borderBottom:
                      cat !== "Non-Technical" ? "1px solid #eee" : "none",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </div>
              ))}
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

      {/* CARD GRID */}
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
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              transition: "0.2s",
            }}
            onClick={(e) => {
              if (
                e.target.dataset.btn === "delete" ||
                e.target.dataset.btn === "use"
              )
                return;
              openEditModal(t);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(0,0,0,0.08)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              <div
                style={{
                  background: "#f1f5f9",
                  padding: "6px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              >
                {t.category}
              </div>
            </div>

            {/* PREVIEW */}
            <div
              style={{
                maxHeight: 40,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                fontSize: 14,
                color: "#444",
              }}
            >
              {t.description}
            </div>

            {/* BUTTONS */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                data-btn="use"
                onClick={() => useTemplate(t.description)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 8,
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
                onClick={() => deleteCard(t.id)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: 8,
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

      {/* ========================= */}
      {/* ADD TEMPLATE MODAL */}
      {/* ========================= */}
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
            zIndex: 200,
          }}
        >
          <div
            style={{
              width: "480px",
              background: "white",
              padding: "30px",
              borderRadius: "18px",
              boxShadow: "0px 8px 25px rgba(0,0,0,0.12)",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>
              Add Template
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label>Job Title</label>
              <input
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                }}
              />

              <label>Category</label>
              <select
                value={modalCategory}
                onChange={(e) => setModalCategory(e.target.value)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                }}
              >
                <option>Technical</option>
                <option>Non-Technical</option>
              </select>

              <label>Description</label>
              <textarea
                value={modalDescription}
                onChange={(e) => setModalDescription(e.target.value)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  minHeight: 140,
                }}
              />

              {/* ⭐ VALIDATION MESSAGE */}
              {validationError && (
                <div
                  style={{
                    color: "#dc2626",
                    fontSize: "14px",
                    marginTop: "-4px",
                  }}
                >
                  {validationError}
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <button
                  onClick={saveNewTemplate}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "#10b981",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>

                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "#94a3b8",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* EDIT TEMPLATE MODAL */}
      {/* ========================= */}
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
            zIndex: 200,
          }}
        >
          <div
            style={{
              width: "480px",
              background: "white",
              padding: "30px",
              borderRadius: "18px",
              boxShadow: "0px 8px 25px rgba(0,0,0,0.12)",
            }}
          >
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>
              Edit Template
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label>Job Title</label>
              <input
                value={modalTitle}
                onChange={(e) => setModalTitle(e.target.value)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                }}
              />

              <label>Category</label>
              <select
                value={modalCategory}
                onChange={(e) => setModalCategory(e.target.value)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                }}
              >
                <option>Technical</option>
                <option>Non-Technical</option>
              </select>

              <label>Description</label>
              <textarea
                value={modalDescription}
                onChange={(e) => setModalDescription(e.target.value)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  minHeight: 140,
                }}
              />

              {/* ⭐ VALIDATION MESSAGE */}
              {validationError && (
                <div
                  style={{
                    color: "#dc2626",
                    fontSize: "14px",
                    marginTop: "-4px",
                  }}
                >
                  {validationError}
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <button
                  onClick={saveEditedTemplate}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "#3b82f6",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>

                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "#94a3b8",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================ */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ============================ */}
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
            zIndex: 300,
          }}
        >
          <div
            style={{
              width: "380px",
              background: "white",
              padding: "26px",
              borderRadius: "16px",
              boxShadow: "0 8px 22px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: 12 }}>Are you sure?</h3>
            <p style={{ marginBottom: 22, color: "#555" }}>
              Do you really want to delete this template?
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#ef4444",
                  borderRadius: "8px",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Delete
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#94a3b8",
                  borderRadius: "8px",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}













