import EditProductView from "@/components/products/EditProductView";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  return <EditProductView id={id} />;
}
