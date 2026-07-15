"use client";

import { useEffect, useState } from "react";
import { listPublishedWorks } from "@/lib/store";

const SEED = [
  {
    id: "seed-c1",
    titulo: "Coletânea Diálogos em Educação — Vol. 3",
    isbn: "978-65-5900-010-2",
    publicadoEm: "2026-04-01T00:00:00.000Z",
    capitulos: [
      { titulo: "Tecnologias digitais na sala de aula", autores: "Ana Beatriz Lima; Carlos Menezes" },
      { titulo: "Formação docente em tempos de IA", autores: "Renata Prado" },
    ],
  },
];

export default function ColetaneasPage() {
  const [colecoes, setColecoes] = useState([]);

  useEffect(() => {
    setColecoes(SEED);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold">Coletâneas de Artigos</h1>
      <p className="mt-2 text-black/60">Edições coletivas organizadas pela Editora Worges.</p>

      <div className="mt-8 space-y-6">
        {colecoes.map((c) => (
          <div key={c.id} className="card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{c.titulo}</h3>
              <button className="btn-secondary text-sm !py-1.5">Baixar coletânea</button>
            </div>
            <p className="text-xs text-black/50 mt-1">ISBN: {c.isbn}</p>
            <ul className="mt-4 divide-y divide-black/5">
              {c.capitulos.map((cap, i) => (
                <li key={i} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{cap.titulo}</p>
                    <p className="text-black/50">{cap.autores}</p>
                  </div>
                  <span className="text-black/40 text-xs">página do capítulo →</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
