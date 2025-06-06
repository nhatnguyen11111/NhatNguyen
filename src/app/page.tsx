// Redesigned UI with updated color palette and layout
import { prisma } from "@/utils/prisma";
import Link from "next/link";
import Image from "next/image";
import SearchFilter from "@/components/SearchFilter";
import { Plus, Package, Pencil } from "lucide-react";
import ProductDeleteButton from "@/components/ProductDeleteButton";
import { Product, Prisma } from "@prisma/client";

const PAGE_SIZE = 8;

async function getProducts(searchParams: { query?: string; price?: string; page?: string }) {
  try {
    const where: Prisma.ProductWhereInput = {
      AND: [
        searchParams.query
          ? {
            OR: [
              { name: { contains: searchParams.query, mode: 'insensitive' } },
            ],
          }
          : {},
      ],
    };

    if (searchParams.price) {
      const [min, max] = searchParams.price.split('-').map(Number);
      if (!where.AND) {
        where.AND = [];
      } else if (!Array.isArray(where.AND)) {
        where.AND = [where.AND];
      }
      where.AND.push({
        price: {
          gte: min,
          ...(max ? { lte: max } : {}),
        },
      });
    }

    const page = parseInt(searchParams.page || '1', 10);
    const skip = (page - 1) * PAGE_SIZE;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
    ]);
    return { products, total };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0 };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; price?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { products, total } = await getProducts(params);
  const page = parseInt(params.page || '1', 10);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-14">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-blue-600 tracking-tight drop-shadow-lg">
            Shoppe
          </h1>
          <Link
            href="/products/add"
            className="inline-flex items-center gap-2 px-7 py-3 text-lg font-bold rounded-3xl shadow-xl text-white bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:scale-105 hover:opacity-95 transition-all duration-200 focus:ring-4 focus:outline-none focus:ring-purple-300"
          >
            <Plus className="w-7 h-7" /> Thêm sản phẩm
          </Link>
        </div>

        <div className="mb-8">
          <SearchFilter />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 mt-10">
          {products.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-8 bg-white/80 rounded-2xl shadow-2xl">
              <Package className="h-24 w-24 text-purple-300 mb-6" />
              <h3 className="text-2xl font-semibold text-purple-900">
                No Products Found
              </h3>
              <p className="mt-3 text-gray-500 text-base">
                Try another search or add a new product.
              </p>
            </div>
          ) : (
            products.map((product: Product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="group bg-white/90 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 overflow-hidden flex flex-col border border-purple-100"
              >
                <div className="relative w-full pt-[100%]">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300 rounded-t-2xl"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      <Package className="h-14 w-14 text-purple-200" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-xl font-bold text-purple-900 line-clamp-2">
                      {product.name}
                    </h2>
                    <p className="text-xl font-extrabold text-pink-600 whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-gray-600 text-base line-clamp-2 mt-4">
                    {product.description}
                  </p>
                  <div className="flex gap-3 mt-6">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-purple-700 bg-purple-100 rounded-full hover:bg-purple-200 transition"
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Link>
                    <ProductDeleteButton productId={product.id} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 mt-16">
            <Link
              href={{ pathname: "/", query: { ...params, page: String(page - 1) } }}
              className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold shadow-md transition-all duration-200 border-2 border-purple-200 ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-purple-700 hover:bg-purple-100 hover:scale-110"}`}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : 0}
            >
              &#8592;
            </Link>
            <span className="text-purple-700 text-lg font-semibold">
              Page {page} of {totalPages}
            </span>
            <Link
              href={{ pathname: "/", query: { ...params, page: String(page + 1) } }}
              className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold shadow-md transition-all duration-200 border-2 border-purple-200 ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-purple-700 hover:bg-purple-100 hover:scale-110"}`}
              aria-disabled={page === totalPages}
              tabIndex={page === totalPages ? -1 : 0}
            >
              &#8594;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
