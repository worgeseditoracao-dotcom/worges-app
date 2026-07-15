"use client";

import { useEffect, useState } from "react";
import {
  listQuotes,
  updateQuote,
  listWorks,
  updateWork,
  createWorkFromQuote,
  formatarData,
} from "@/lib/store";
import { formatarMoeda } from "@/lib/pricing";
import { CONFIG } from "@/lib/config";

export default function AdminPage() {
  const [quotes, setQuotes] = useState([]);
  const [works, setWorks] = useState([]);

  function refresh() {
    setQuotes(listQuotes());
    setWorks(listWorks());
  }

  useEffect(() => {
    refresh();
  }, []);

  function simularPagamentoAprovado(quote) {
    updateQuote(quote.id, { status: "pago" });
    const jaExiste = listWorks().some((w) => w.quoteId === quote.id);
    if (!jaExiste) {
      createWorkFromQuote({ ...quote, status: "pago" });
    }
    refresh();
  }

  function avancarEtapa(work, novaEtapa) {
    updateWork(work.id, { etapaAtual: novaEtapa });
    refresh();
  }

  function editarPrazo(work, novaData) {
    updateWork(work.id, { dataPrevista: new Date(novaData).toISOString() });
    refresh();
  }

  const obrasPorSemana = agruparPorSemana(works);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      <div>
        <h1 className="text-3xl font-serif font-bold">Painel do administrador</h1>
        <p className="text-black/60 mt-1">
          Gestão de orçamentos, pagamentos e processo editorial das obras.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold">Solicitações de orçamento</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-black/10 text-black/50">
                <th className="py-2 pr-4">Código</th>
                <th className="py-2 pr-4">Autor</th>
                <th className="py-2 pr-4">Obra</th>
                <th className="py-2 pr-4">Contato</th>
                <th className="py-2 pr-4">Pacote</th>
                <th className="py-2 pr-4">Valor</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Ação</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr key={q.id} className="border-b border-black/5">
                  <td className="py-2 pr-4">{q.id}</td>
                  <td className="py-2 pr-4">{q.nome}</td>
                  <td className="py-2 pr-4">{q.tituloObra}</td>
                  <td className="py-2 pr-4">{q.email}<br />{q.telefone}</td>
                  <td className="py-2 pr-4">{q.pacote}</td>
                  <td className="py-2 pr-4">{formatarMoeda(q.total)}</td>
                  <td className="py-2 pr-4">
                    <span className={`badge ${q.status === "pago" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {q.status === "pago" ? "Pago" : "Aguardando"}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    {q.status !== "pago" ? (
                      <button className="btn-secondary !py-1 !px-2 text-xs" onClick={() => simularPagamentoAprovado(q)}>
                        Simular pagamento aprovado
                      </button>
                    ) : (
                      <a href={q.linkPagamento} target="_blank" rel="noreferrer" className="text-xs text-black/40">
                        link de pagamento
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr><td colSpan={8} className="py-6 text-center text-black/40">Nenhum orçamento solicitado ainda.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Calendário de obras pendentes</h2>
        <p className="text-sm text-black/50 mt-1">
          Datas propostas automaticamente pelo sistema (dias úteis a partir do pagamento). Ajuste conforme a fila editorial.
        </p>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {Object.entries(obrasPorSemana).map(([semana, lista]) => (
            <div key={semana} className="card">
              <p className="font-semibold text-sm">{semana}</p>
              <ul className="mt-2 space-y-2 text-sm">
                {lista.map((w) => (
                  <li key={w.id} className="flex items-center justify-between gap-2">
                    <span>{w.titulo} <span className="text-black/40">({w.autor})</span></span>
                    <input
                      type="date"
                      className="input !py-1 !px-2 text-xs w-auto"
                      defaultValue={w.dataPrevista?.slice(0, 10)}
                      onChange={(e) => editarPrazo(w, e.target.value)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {works.length === 0 && <p className="text-black/40 text-sm">Nenhuma obra em processo ainda.</p>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Processo editorial das obras</h2>
        <div className="mt-4 space-y-4">
          {works.map((w) => (
            <div key={w.id} className="card">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-medium">{w.titulo} <span className="text-black/40 font-normal">· {w.autor}</span></p>
                  <p className="text-xs text-black/50">Prazo: {formatarData(w.dataPrevista)}</p>
                </div>
                <span className="badge bg-worges/10 text-worges">{CONFIG.etapasLabels[w.etapaAtual]}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {CONFIG.etapasProcessoObra.map((etapa) => (
                  <button
                    key={etapa}
                    className={`badge text-xs ${w.etapaAtual === etapa ? "bg-worges text-white" : "bg-black/5 hover:bg-black/10"}`}
                    onClick={() => avancarEtapa(w, etapa)}
                  >
                    {CONFIG.etapasLabels[etapa]}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {works.length === 0 && <p className="text-black/40 text-sm">Nenhuma obra em processo ainda.</p>}
        </div>
      </section>
    </div>
  );
}

function agruparPorSemana(works) {
  const grupos = {};
  for (const w of works) {
    if (w.etapaAtual === "publicado") continue;
    const data = w.dataPrevista ? new Date(w.dataPrevista) : new Date();
    const inicioSemana = new Date(data);
    inicioSemana.setDate(data.getDate() - data.getDay());
    const label = `Semana de ${inicioSemana.toLocaleDateString("pt-BR")}`;
    grupos[label] = grupos[label] || [];
    grupos[label].push(w);
  }
  return grupos;
}
