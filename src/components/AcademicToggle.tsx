"use client";

export default function AcademicToggle() {
  return (
    <button
      type="button"
      className="btn btn-ios academic-toggle-active"
      style={{ fontSize: "0.8125rem", padding: "0.4rem 0.85rem" }}
      title="Modo academico permanente"
      aria-label="Modo academico permanente"
      disabled
    >
      <i className="bi bi-mortarboard-fill me-1"></i>
      Academico
    </button>
  );
}
