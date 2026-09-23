// Form validation for add/edit. Returns { fieldName: "error message" };
// an empty object means the form is valid.
export function validateProduct(values) {
  const errors = {};
  const title = values.title.trim();
  const price = Number(values.price);
  const stock = Number(values.stock);
  const discount = Number(values.discountPercentage || 0);

  if (!title) errors.title = "Title is required";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters";
  else if (title.length > 100) errors.title = "Title must be 100 characters or less";

  if (!values.category) errors.category = "Pick a category";

  if (values.price === "") errors.price = "Price is required";
  else if (!Number.isFinite(price) || price <= 0) errors.price = "Price must be more than 0";
  else if (price > 1_000_000) errors.price = "Price is too high";

  if (values.stock === "") errors.stock = "Stock is required";
  else if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number, 0 or more";

  if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
    errors.discountPercentage = "Discount must be between 0 and 100";
  }

  if (values.description.trim().length > 1000) errors.description = "Description must be 1000 characters or less";

  if (values.thumbnail.trim() && !/^https?:\/\/\S+$/i.test(values.thumbnail.trim())) {
    errors.thumbnail = "Enter a full image URL starting with http:// or https://";
  }

  return errors;
}

/** Convert form strings into the shape the API expects. */
export function toProductPayload(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    brand: values.brand.trim(),
    price: Number(values.price),
    discountPercentage: Number(values.discountPercentage || 0),
    stock: Number(values.stock),
    thumbnail: values.thumbnail.trim(),
  };
}

export function toFormValues(product = {}) {
  return {
    title: product.title ?? "",
    description: product.description ?? "",
    category: product.category ?? "",
    brand: product.brand ?? "",
    price: product.price?.toString() ?? "",
    discountPercentage: product.discountPercentage?.toString() ?? "",
    stock: product.stock?.toString() ?? "",
    thumbnail: product.thumbnail ?? "",
  };
}
