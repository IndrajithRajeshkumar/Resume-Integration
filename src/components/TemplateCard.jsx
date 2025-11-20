"use client";
import React from "react";

export default function TemplateCard({ template, onUse, onEdit, onDelete }) {
  return (
    <div className="template-card">
      <div className="card-head">
        <h3 className="card-title">{template.title || "Untitled"}</h3>
        <span className="card-category">{template.category || "Technical"}</span>
      </div>

      <textarea
        className="card-desc"
        readOnly
        value={template.description || ""}
        aria-label={`Description for ${template.title}`}
      />

      <div className="card-actions">
        <button className="btn btn-edit" onClick={() => onEdit(template.id)}>
          Edit
        </button>
        <button className="btn btn-use" onClick={() => onUse(template.id)}>
          Use
        </button>
        <button className="btn btn-delete" onClick={() => onDelete(template.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
