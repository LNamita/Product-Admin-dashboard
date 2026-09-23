import ProductDetails from "@/components/products/ProductDetails";

// In Next.js 16, `params` is a Promise.
export default async function ProductPage({ params }) {
  const { id } = await params;
  return <ProductDetails id={id} />;
}
