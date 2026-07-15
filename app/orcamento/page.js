"use client";

import { useOrcamento } from "@/lib/useOrcamento";
import { CONFIG } from "@/lib/config";
import ResultadoOrcamento from "@/components/ResultadoOrcamento";

export default function OrcamentoPage() {
  const orc = useOrcamento();

  const podeGerar =
    orc.paginas &&
    orc.nome.trim() &&
    orc.tituloObra.trim() &&
    orc.email.trim() &&
    orc.telefone.trim();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold">Gerar orçamento</h1>
      <p className="mt-2 text-black/60">
        Preencha os dados abaixo e envie seu arquivo em Word para receber um orçamento
        válido para hoje, calculado automaticamente conforme os preços vigentes.
      </p>

      <div className="mt-8 card space-y-6">
        <div>
          <label className="text-sm font-medium">Tipo de publicação</label>
          <div className="mt-2 flex gap-3">
            <button
              className={`btn-secondary ${orc.tipo === "livro" ? "!bg-worges !text-white" : ""}`}
              onClick={() => orc.setTipo("livro")}
            >
              Livro individual
            </button>
            <button
              className={`btn-secondary ${orc.tipo === "coletanea" ? "!bg-worges !text-white" : ""}`}
              onClick={() => orc.setTipo("coletanea")}
            >
              Capítulo de coletânea
            </button>
          </div>
        </div>

        {orc.tipo === "livro" ? (
          <div>
            <label className="text-sm font-medium">Pacote</label>
            <div className="mt-2 grid sm:grid-cols-3 gap-3">
              {CONFIG.pacotesObra.map((p) => (
                <button
                  key={p.chave}
                  onClick={() => orc.setPacoteChave(p.chave)}
                  className={`card text-left !p-4 ${orc.pacoteChave === p.chave ? "ring-2 ring-worges" : ""}`}
                >
                  <p className="font-semibold">{p.nome}</p>
                  <p className="text-xs text-black/50 mt-1">{p.descricao}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium">Número de capítulos</label>
            <input
              type="number"
              min={1}
              className="input mt-2 max-w-[120px]"
              value={orc.numeroCapitulos}
              onChange={(e) => orc.setNumeroCapitulos(Number(e.target.value) || 1)}
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Arquivo da obra (.docx)</label>
          <input
            type="file"
            accept=".docx"
            className="input mt-2"
            onChange={(e) => e.target.files?.[0] && orc.processarArquivo(e.target.files[0])}
          />
          {orc.processandoArquivo && <p className="text-xs text-black/50 mt-1">Lendo arquivo…</p>}
          {orc.erroArquivo && <p className="text-xs text-red-600 mt-1">{orc.erroArquivo}</p>}
          {orc.paginas && (
            <p className="text-xs text-green-700 mt-1">
              {orc.caracteres.toLocaleString("pt-BR")} caracteres · {orc.paginas} página(s) editorial(is) estimada(s)
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Seu nome</label>
            <input className="input mt-2" value={orc.nome} onChange={(e) => orc.setNome(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Título da obra</label>
            <input className="input mt-2" value={orc.tituloObra} onChange={(e) => orc.setTituloObra(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">E-mail</label>
            <input type="email" className="input mt-2" value={orc.email} onChange={(e) => orc.setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Telefone / WhatsApp</label>
            <input className="input mt-2" value={orc.telefone} onChange={(e) => orc.setTelefone(e.target.value)} />
          </div>
        </div>

        <button className="btn-primary" disabled={!podeGerar} onClick={() => orc.gerarOrcamento()}>
          Gerar orçamento
        </button>
      </div>

      {orc.resultado && (
        <div className="mt-8">
          <ResultadoOrcamento resultado={orc.resultado} />
        </div>
      )}
    </div>
  );
}
