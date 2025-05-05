"use client"

import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.png" alt="Logo TransKampus Medan" width={70} height={70} />
          <span className="text-xl font-bold">TransKampus Medan</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-emerald-600 transition-colors">
        Fitur
          </Link>
          <Link href="#map" className="text-sm font-medium hover:text-emerald-600 transition-colors">
        Peta
          </Link>
          <Link href="#about" className="text-sm font-medium hover:text-emerald-600 transition-colors">
        Tentang
          </Link>
          <Link href="#team" className="text-sm font-medium hover:text-emerald-600 transition-colors">
        Our Team
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:text-emerald-600 transition-colors">
        Kontak
          </Link>
        </nav>
      </div>
    </header>
  )
}
