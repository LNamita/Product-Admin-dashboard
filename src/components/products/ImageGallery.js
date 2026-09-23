"use client";

import { useState } from "react";
import ProductImage from "./ProductImage";

export default function ImageGallery({ images, title }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <ProductImage src={current} alt={title} className="aspect-square w-full rounded-xl object-contain" />
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`shrink-0 rounded-lg ring-2 ${i === active ? "ring-indigo-600" : "ring-transparent"}`}
            >
              <ProductImage src={src} alt="" className="h-16 w-16 rounded-lg" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
