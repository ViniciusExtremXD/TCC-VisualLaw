import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/ui/components/Icon";
import { SessionProvider } from "@/store/SessionContext";
import { strings } from "@/i18n/ptBR";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visual Law TCC",
  description:
    "Ambiente acadêmico para auditoria de Termos de Serviço e Políticas de Privacidade com semiótica explícita e rastreabilidade.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <SessionProvider>
          <nav className="navbar ios-navbar sticky-top">
            <div className="container" style={{ maxWidth: 720 }}>
              <Link
                href="/"
                className="navbar-brand d-flex align-items-center gap-2 fw-bold text-ios-accent"
              >
                <span className="ios-icon-surface">
                  <Icon name="shield-check" size={19} />
                </span>
                {strings.app.title}
              </Link>

              <span className="d-none d-sm-inline text-ios-secondary" style={{ fontSize: "0.8125rem" }}>
                {strings.app.subtitle}
              </span>
            </div>
          </nav>

          <main className="container mx-auto w-full max-w-3xl py-4" style={{ maxWidth: 720 }}>
            {children}
          </main>

          <footer className="text-center py-4 mt-5">{strings.app.footer}</footer>
        </SessionProvider>
      </body>
    </html>
  );
}
