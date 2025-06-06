"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string | null;
  };
  mode: "add" | "edit";
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image || null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      image: imagePreview,
    };

    try {
      const response = await fetch(
        mode === "add" ? "/api/products" : `/api/products/${product?.id}`,
        {
          method: mode === "add" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success(
        mode === "add"
          ? "Product added successfully"
          : "Product updated successfully"
      );
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 card max-w-xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-[var(--primary)] mb-6 text-center">
        {mode === "add" ? "Thêm sản phẩm mới" : "Cập nhật sản phẩm"}
      </h2>
      <div>
        <label htmlFor="name" className="block text-base font-semibold text-[var(--primary)] mb-2">Tên sản phẩm</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={product?.name}
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-base font-semibold text-[var(--primary)] mb-2">Mô tả</label>
        <textarea
          name="description"
          id="description"
          required
          rows={4}
          defaultValue={product?.description}
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-base font-semibold text-[var(--primary)] mb-2">Giá</label>
        <input
          type="number"
          name="price"
          id="price"
          required
          min="0"
          step="0.01"
          defaultValue={product?.price}
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-base font-semibold text-[var(--primary)] mb-2">Hình ảnh</label>
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
        {imagePreview && (
          <div className="relative w-24 h-24 mt-4 mx-auto">
            <Image
              width={96}
              height={96}
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-xl border border-[var(--border)] shadow"
            />
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
            >×</button>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-[var(--secondary)] text-[var(--primary)] px-6 py-2 rounded-xl font-semibold border-none shadow hover:bg-[var(--accent)]"
        >Huỷ</button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-xl font-semibold bg-[var(--primary)] text-white shadow hover:bg-[var(--primary-hover)] disabled:opacity-60"
        >{loading ? "Đang lưu..." : mode === "add" ? "Thêm sản phẩm" : "Cập nhật"}</button>
      </div>
    </form>
  );
}
