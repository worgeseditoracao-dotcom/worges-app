"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSession, clearSession } from "@/lib/store";

export default function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getSession());
  }, []);

  return (
    <header className="border-b border-black/5 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-bold text-worges">
          Editora Worges
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/publicacoes" className="hover:text-worges">Publicações</Link>
          <Link href="/coletaneas" className="hover:text-worges">Coletâneas</Link>
          <Link href="/agente" className="hover:text-worges">Assistente Editorial</Link>
          <Link href="/orcamento" className="hover:text-worges">Orçamento</Link>
          <Link href="/admin" className="hover:text-worges">Admin</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/perfil" className="btn-secondary !py-1.5 !px-3 text-sm">
                Olá, {user.nome.split(" ")[0]}
              </Link>
              <button
                onClick={() => {
                  clearSession();
                  setUser(null);
                  window.location.href = "/";
                }}
                className="text-sm text-black/50 hover:text-black"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary !py-1.5 !px-3 text-sm">
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
