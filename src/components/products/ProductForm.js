"use client";

import { useState } from "react";
import Link from "next/link";
import useCategories from "@/hooks/useCategories";
import useSubmitGuard from "@/hooks/useSubmitGuard";
import { toFormValues, toProductPayload, validateProduct } from "@/lib/validateProduct";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

/**
 * Shared form for "Add product" and "Edit product".
 * `onSubmit` receives a clean payload and should throw on failure.
 */
export default function ProductForm({ initialProduct, submitLabel, cancelHref, onSubmit }) {
  const { categories } = useCategories();
  const [values, setValues] = useState(() => toFormValues(initialProduct));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  // useSubmitGuard: clicking Save many times still sends only one request.
  const [save, saving] = useSubmitGuard(async () => {
    setFormError("");
    try {
      await onSubmit(toProductPayload(values));
    } catch (error) {
      setFormError(error.message || "Could not save the product.");
    }
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the user fixes it.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validateProduct(values);
    setErrors(found);
    if (Object.keys(found).length === 0) save();
  }

  const field = (name) => ({ name, value: values[name], onChange: handleChange, error: errors[name] });

  // Keep the current category visible even if the category list failed to load.
  const categoryOptions =
    values.category && !categories.some((c) => c.slug === values.category)
      ? [{ slug: values.category, name: values.category }, ...categories]
      : categories;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl bg-white p-6 ring-1 ring-slate-200">
      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}

      <TextField label="Title *" {...field("title")} />
      <TextField label="Description" as="textarea" rows={4} {...field("description")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Category *" as="select" {...field("category")}>
          <option value="">Select a category</option>
          {categoryOptions.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </TextField>
        <TextField label="Brand" {...field("brand")} />
        <TextField label="Price (USD) *" type="number" min="0" step="0.01" inputMode="decimal" {...field("price")} />
        <TextField label="Discount %" type="number" min="0" max="100" step="0.01" {...field("discountPercentage")} />
        <TextField label="Stock *" type="number" min="0" step="1" inputMode="numeric" {...field("stock")} />
        <TextField label="Image URL" type="url" placeholder="https://…" {...field("thumbnail")} />
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-5">
        <Link
          href={cancelHref}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <Button type="submit" loading={saving}>
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
