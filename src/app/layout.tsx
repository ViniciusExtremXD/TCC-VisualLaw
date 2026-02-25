import type { Metadata } from "next";
import Link from "next/link";
import { SessionProvider } from "@/store/SessionContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visual Law TCC - Modo Academico",
  description:
    "Ambiente academico para auditoria de Termos de Servico e Politicas de Privacidade com semiótica explicita e rastreabilidade.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <SessionProvider>
          <nav className="navbar ios-navbar sticky-top">
            <div className="container" style={{ maxWidth: 720 }}>
              <Link href="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-ios-accent">
                <i className="bi bi-shield-check fs-4"></i>
                Visual Law
              </Link>

              <div className="d-flex align-items-center gap-2">
                <Link
                  href="/swagger/"
                  className="btn btn-ios btn-ios-tertiary"
                  style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}
                >
                  <i className="bi bi-diagram-3 me-1"></i>
                  Swagger
                </Link>
                <span className="d-none d-sm-inline text-ios-secondary" style={{ fontSize: "0.8125rem" }}>
                  TCC - IHC / Mackenzie
                </span>
              </div>
            </div>
          </nav>

          <main className="container mx-auto w-full max-w-3xl py-4" style={{ maxWidth: 720 }}>
            {children}
          </main>

          <footer className="text-center py-4 mt-5">
            Visual Law TCC - Modo Academico - Entrada por texto - Dicionario Lexico + Auditoria
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
