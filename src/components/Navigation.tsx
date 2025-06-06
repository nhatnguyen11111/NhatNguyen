"use client";

import Link from "next/link";
// import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export default function Navigation() {
  // const pathname = usePathname();

  return (
    <nav className="bg-white/80 backdrop-blur shadow-lg fixed top-0 left-0 right-0 z-20 border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-md">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent tracking-tight">
                E-Shop
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/products/add"
              className="px-5 py-2 rounded-xl bg-[var(--primary)] text-white font-semibold shadow hover:bg-[var(--primary-hover)] transition-all"
            >
              + Thêm sản phẩm
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
