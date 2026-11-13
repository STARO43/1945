import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "1941–1945. Великая Отечественная война",
  description:
    "История Великой Отечественной войны: нападение на СССР, тыл, герои фронта, разгром фашистских захватчиков, единство народов, Победа и разгром Японии.",
  keywords: ["1941", "1945", "Великая Отечественная война", "история", "Победа"],
};

export const viewport: Viewport = {
  themeColor: "#0b0b0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
