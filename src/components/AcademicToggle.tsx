"use client";

import { useSession } from "@/store/SessionContext";

export default function AcademicToggle() {
  const { academicMode, setAcademicMode } = useSession();

  return (
    <button
      onClick={() => setAcademicMode(!academicMode)}
      className={`btn btn-ios ${academicMode ? "academic-toggle-active" : "btn-ios-tertiary"}`}
      style={{ fontSize: "0.8125rem", padding: "0.4rem 0.85rem" }}
      title={academicMode ? "Modo Acadêmico (auditoria visível)" : "Modo Produto (UI limpa)"}
    >
      <i className={`bi ${academicMode ? "bi-mortarboard-fill" : "bi-mortarboard"} me-1`}></i>
      {academicMode ? "Acadêmico" : "Produto"}
    </button>
  );
}
