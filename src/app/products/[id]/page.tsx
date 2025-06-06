import { prisma } from "@/utils/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </div>

          <div className="card flex flex-col md:flex-row gap-8 p-8 mt-10 max-w-4xl mx-auto">
            <div className="flex-shrink-0 w-full md:w-1/2 flex items-center justify-center">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={320}
                  height={320}
                  className="object-cover rounded-2xl border border-[var(--border)] shadow-lg w-80 h-80"
                />
              ) : (
                <div className="w-80 h-80 bg-[var(--accent)] flex items-center justify-center rounded-2xl text-4xl text-white font-bold">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-extrabold text-[var(--primary)] mb-4">{product.name}</h1>
                <p className="text-3xl font-bold text-[var(--primary)] mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-lg text-[var(--foreground)] mb-8">{product.description}</p>
              </div>
              <div className="flex gap-4 mt-6">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="flex-1 inline-flex items-center justify-center px-6 py-2 rounded-xl font-semibold bg-[var(--primary)] text-white shadow hover:bg-[var(--primary-hover)]"
                >
                  <Pencil className="w-5 h-5 mr-2" /> Chỉnh sửa
                </Link>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this product?')) {
                      try {
                        const response = await fetch(`/api/products/${product.id}`, {
                          method: 'DELETE',
                        });
                        if (response.ok) {
                          window.location.href = '/';
                        }
                      } catch (error) {
                        console.error('Error deleting product:', error);
                      }
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center px-6 py-2 rounded-xl font-semibold bg-red-500 text-white shadow hover:bg-red-600"
                >
                  <Trash2 className="w-5 h-5 mr-2" /> Xoá sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
