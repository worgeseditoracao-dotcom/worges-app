"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { findOrCreateUser, setSession } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  function entrar() {
    if (!nome.trim() || !email.trim()) return;
    const user = findOrCreateUser({ nome, email, telefone });
    setSession(user);
    router.push("/perfil");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-serif font-bold">Entrar no meu perfil</h1>
      <p className="text-sm text-black/60 mt-2">
        Use o mesmo e-mail informado ao solicitar seu orçamento. Este protótipo usa um
        login simplificado, sem senha — em produção, substitua por autenticação real
        (ex.: NextAuth, magic link por e-mail, etc.).
      </p>

      <div className="card mt-6 space-y-3">
        <input className="input" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input className="input" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Telefone (opcional)" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <button className="btn-primary w-full" onClick={entrar} disabled={!nome || !email}>
          Entrar
        </button>
      </div>
    </div>
  );
}
