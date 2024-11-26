import React from "react"
import Image from "next/image"
import Link from "next/link"

export const Header = () => {
  return (
    <header className="flex w-full flex-row justify-between bg-zinc-900 px-5 py-2 text-center md:px-8 md:py-4">
      <Image src="/logo.svg" alt="Logo" width={202} height={40} />
      <nav className="flex flex-row items-center gap-4 text-sm">
        <Link className="transition-all hover:underline" href="/">
          Pedir uma viagem
        </Link>
        <Link className="transition-all hover:underline" href="/ride-list">
          Minhas viagens
        </Link>
      </nav>
    </header>
  )
}
