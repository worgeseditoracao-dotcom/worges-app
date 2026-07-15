"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, listQuotes, listWorksByUser, updateQuote } from "@/lib/store";
import { formatarMoeda } from "@/lib/pricing";
import { formatarData } from "@/lib/store";
import WorkCard from "@/components/WorkCard";

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [works, setWorks] = useState([]);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setUser(session);
    setQuotes(listQuotes().filter((q) => q.userId === session.id));
    setWorks(listWorksByUser(session.id));
  }, [router]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-serif font-bold">Meu perfil</h1>
        <p className="text-black/60 mt-1">
          {user.nome} · {user.email} {user.telefone && `· ${user.telefone}`}
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold">Meus orçamentos</h2>
        <div className="mt-4 space-y-3">
          {quotes.length === 0 && <p className="text-black/50 text-sm">Nenhum orçamento solicitado ainda.</p>}
          {quotes.map((q) => (
            <div key={q.id} className="card flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-medium">{q.tituloObra} <span className="text-black/40 font-normal">· {q.id}</span></p>
                <p className="text-sm text-black/60">
                  {q.pacote} · {formatarMoeda(q.total)} · gerado em {formatarData(q.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`badge ${
                    q.status === "pago" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {q.status === "pago" ? "Pago" : "Aguardando pagamento"}
                </span>
                {q.status !== "pago" && (
                  <a href={q.linkPagamento} target="_blank" rel="noreferrer" className="btn-primary !py-1.5 !px-3 text-sm">
                    Pagar
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Minhas obras em processo editorial</h2>
        <div className="mt-4 space-y-6">
          {works.length === 0 && (
            <p className="text-black/50 text-sm">
              Assim que o pagamento de um orçamento for confirmado, a obra aparece aqui.
            </p>
          )}
          {works.map((w) => (
            <WorkCard
              key={w.id}
              work={w}
              onChange={(updated) => setWorks((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
