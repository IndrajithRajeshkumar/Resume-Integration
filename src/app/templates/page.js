"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const router = useRouter();

  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("templates");
    if (saved) setTemplates(JSON.parse(saved));
  }, []);

  const saveToStorage = (updated) => {
    localStorage.setItem("templates", JSON.stringify(updated));
    setTemplates(updated);
  };

  const addCard = () => {
    const newCard = {
      id: Date.now().toString(),
      title: "",
      category: "Technical",
      description: "",
    };
    saveToStorage([...templates, newCard]);
  };

  const updateCard = (id, key, value) => {
    const updated = templates.map((t) =>
      t.id === id ? { ...t, [key]: value } : t
    );
    saveToStorage(updated);
  };

  const deleteCard = (id) => {
    saveToStorage(templates.filter((t) => t.id !== id));
  };

  const useTemplate = (text) => {
    localStorage.setItem("dashboardDescription", text);
    router.push("/");
  };

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" ? true : t.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "600", marginBottom: "20px" }}>
        Templates
      </h1>

      {/* Search + Categories + Add */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        <input
          placeholder="Search templates…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "260px",
            transition: "0.2s",
          }}
          onFocus={(e) => (e.target.style.border = "1px solid #3b82f6")}
          onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
        />

        {/* CATEGORY BUTTON */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowCategories(!showCategories)}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#f1f5f9")}
            onMouseLeave={(e) => (e.target.style.background = "white")}
          >
            Categories ▼
          </button>

          {/* DROPDOWN */}
          <div
            style={{
              position: "absolute",
              top: "45px",
              left: "0",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              width: "150px",
              overflow: "hidden",
              opacity: showCategories ? 1 : 0,
              transform: showCategories ? "translateY(0)" : "translateY(10px)",
              transition: "0.2s ease",
              pointerEvents: showCategories ? "auto" : "none",
              zIndex: 100,
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
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom:
                    cat !== "Non-Technical" ? "1px solid #eee" : "none",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "white")
                }
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={addCard}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#10b981",
            color: "white",
            cursor: "pointer",
            marginLeft: "auto",
            transition: "0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          + Add Card
        </button>
      </div>

      {/* TEMPLATE CARD GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "24px",
        }}
      >
        {filteredTemplates.map((card) => (
          <div
            key={card.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "14px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              transition: "0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0px 8px 20px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0px 4px 10px rgba(0,0,0,0.08)";
            }}
          >
            <input
              value={card.title}
              onChange={(e) =>
                updateCard(card.id, "title", e.target.value)
              }
              placeholder="Title"
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
                transition: "0.2s",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #3b82f6")}
              onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
            />

            <select
              value={card.category}
              onChange={(e) =>
                updateCard(card.id, "category", e.target.value)
              }
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                transition: "0.2s",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #3b82f6")}
              onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
            >
              <option>Technical</option>
              <option>Non-Technical</option>
            </select>

            <textarea
              value={card.description}
              onChange={(e) =>
                updateCard(card.id, "description", e.target.value)
              }
              placeholder="Description"
              style={{
                padding: "12px",
                minHeight: "120px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                resize: "vertical",
                transition: "0.2s",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #3b82f6")}
              onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "8px",
              }}
            >
              <button
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.transform = "scale(1)")
                }
              >
                Edit
              </button>

              <button
                onClick={() => useTemplate(card.description)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#6b46c1",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.transform = "scale(1)")
                }
              >
                Use
              </button>

              <button
                onClick={() => deleteCard(card.id)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.transform = "scale(1)")
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BACK */}
      <button
        onClick={() => router.push("/")}
        style={{
          marginTop: "25px",
          padding: "10px 18px",
          borderRadius: "8px",
          background: "#64748b",
          color: "white",
          border: "none",
          cursor: "pointer",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        ← Back
      </button>
    </div>
  );
}










