import AppHeader from "@/components/layout/AppHeader";
import Toaster from "@/components/ui/Toaster";

// Shared shell for every page under /products (all of them need login,
// which is checked in src/proxy.js).
export default function ProductsLayout({ children }) {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
      <Toaster />
    </>
  );
}
