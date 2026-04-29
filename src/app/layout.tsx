import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/ui/components/Icon";
import { DocumentEngineProvider } from "@/document_engine/DocumentEngineProvider";
import { SessionProvider } from "@/store/SessionContext";
import { strings } from "@/i18n/ptBR";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visual Law para Termos Digitais",
  description:
    "Ferramenta de leitura assistida de Termos de Serviço e Políticas de Privacidade com semiótica explícita e rastreabilidade.",
  icons: {
    icon: "/favicon.svg",
  },
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
          <DocumentEngineProvider>
            <nav className="navbar ios-navbar sticky-top shadow-sm border-0">
              <div className="container vl-nav-container">
                <Link
                  href="/"
                  className="navbar-brand d-flex align-items-center gap-2 fw-bold text-ios-accent"
                >
                  <span className="ios-icon-surface">
                    <Icon name="shield-check" size={19} />
                  </span>
                  <span>{strings.app.title}</span>
                  <span className="vl-nav-divider d-none d-lg-inline px-2 text-muted fw-normal">|</span>
                  <span className="vl-nav-domain d-none d-lg-inline text-ios-secondary fw-normal fs-6">
                    {strings.app.subtitle}
                  </span>
                </Link>
              </div>
            </nav>

            <main className="container mx-auto w-full py-4" style={{ maxWidth: 1040 }}>
              {children}
            </main>

            <footer className="text-center py-4 mt-5">{strings.app.footer}</footer>
          </DocumentEngineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
