"use client";

import { formatarMoeda } from "@/lib/pricing";
import { formatarData } from "@/lib/store";

export default function ResultadoOrcamento({ resultado }) {
  if (!resultado) return null;

  return (
    <div className="card border-worges/30">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-worges">Orçamento {resultado.id}</h3>
        <span className="badge bg-green-100 text-green-700">Válido hoje até 23:59</span>
      </div>
      <p className="text-sm text-black/60 mt-1">
        Obra: <strong>{resultado.tituloObra}</strong> · Pacote: <strong>{resultado.pacote}</strong> ·{" "}
        {resultado.paginas} página(s) estimada(s)
      </p>

      <ul className="mt-4 divide-y divide-black/5 text-sm">
        {resultado.linhas.map((linha, i) => (
          <li key={i} className="py-2 flex items-center justify-between">
            <div>
              <p>{linha.descricao}</p>
              <p className="text-xs text-black/40">{linha.detalhe}</p>
            </div>
            <span>{formatarMoeda(linha.valor)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-bold text-worges">{formatarMoeda(resultado.total)}</span>
      </div>

      <p className="mt-2 text-xs text-black/50">
        Prazo estimado: {resultado.prazoDiasUteis} dias úteis após confirmação do pagamento.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <a href={resultado.linkPagamento} target="_blank" rel="noreferrer" className="btn-primary">
          Pagar agora (Mercado Pago)
        </a>
        <span className="text-xs text-black/40 self-center">
          Acompanhe este orçamento em seu perfil após o login.
        </span>
      </div>
    </div>
  );
}
