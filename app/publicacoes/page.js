"use client";

import { useEffect, useState } from "react";
import { listPublishedWorks } from "@/lib/store";

const SEED = [
  {
    id: "seed-1",
    titulo: "Ventos do Sertão",
    autor: "Maria Clara Souza",
    resumo: "Uma saga familiar ambientada no interior do Ceará, atravessando três gerações.",
    isbn: "978-65-5900-001-4",
    doi: null,
    visibilidade: "vitrine_com_download",
    publicadoEm: "2026-03-10T00:00:00.000Z",
  },
  {
    id: "seed-2",
    titulo: "Fragmentos de Concreto",
    autor: "João Pedro Alves",
    resumo: "Poemas urbanos sobre a vida nas grandes cidades brasileiras.",
    isbn: "978-65-5900-002-1",
    doi: "10.65432/worges.00002",
    visibilidade: "vitrine_sem_download",
    publicadoEm: "2026-05-22T00:00:00.000Z",
  },
];

export default function PublicacoesPage() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    setWorks([...SEED, ...listPublishedWorks().filter((w) => w.tipo !== "coletanea")]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold">Publicações</h1>
      <p className="mt-2 text-black/60">Obras publicadas pela Editora Worges.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {works.map((w) => (
          <div key={w.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{w.titulo}</h3>
                <p className="text-sm text-black/60">{w.autor}</p>
              </div>
              <span className="badge bg-worges/10 text-worges shrink-0">
                {new Date(w.publicadoEm).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <p className="mt-3 text-sm text-black/70">{w.resumo || "Resumo não informado."}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-black/50">
              <span className="badge bg-black/5">ISBN: {w.isbn || "—"}</span>
              {w.doi && <span className="badge bg-black/5">DOI: {w.doi}</span>}
            </div>
            {w.visibilidade === "vitrine_com_download" && (
              <button className="btn-secondary mt-4 text-sm !py-1.5">Baixar obra</button>
            )}
          </div>
        ))}
        {works.length === 0 && (
          <p className="text-black/50">Nenhuma obra publicada ainda.</p>
        )}
      </div>
    </div>
  );
}
