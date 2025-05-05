import Link from "next/link"
import { Navigation } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
         <Image src="/images/logo.png" alt="Logo TransKampus Medan"width={70} height={70} />
          <span className="text-lg font-semibold">TransKampus Medan</span>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} TransKampus Medan. Hak Cipta Dilindungi.
        </p>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-emerald-600">
            Kebijakan Privasi
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-emerald-600">
            Syarat & Ketentuan
          </Link>
        </div>
      </div>
    </footer>
  )
}
