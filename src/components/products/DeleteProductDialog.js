import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function DeleteProductDialog({ product, deleting, onConfirm, onCancel }) {
  return (
    <ConfirmDialog
      open={Boolean(product)}
      title="Delete product?"
      message={product ? `"${product.title}" will be removed. This cannot be undone.` : ""}
      loading={deleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
