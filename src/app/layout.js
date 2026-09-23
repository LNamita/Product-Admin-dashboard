import "./globals.css";

export const metadata = {
  title: "Product Admin Dashboard",
  description: "Manage products using the DummyJSON API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
