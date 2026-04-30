import type { Metadata } from "next";
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
