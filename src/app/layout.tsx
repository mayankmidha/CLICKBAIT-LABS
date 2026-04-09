import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { RoleProvider } from "@/lib/store/RoleContext";

export const metadata: Metadata = {
  title: "CLICKBAIT Production Console",
  description: "High-retention content management for founders and creators.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased min-h-screen flex flex-col md:flex-row">
        <RoleProvider>
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 md:py-12 pb-24 md:pb-12">
            {children}
          </main>
          <MobileNav />
        </RoleProvider>
      </body>
    </html>
  );
}
