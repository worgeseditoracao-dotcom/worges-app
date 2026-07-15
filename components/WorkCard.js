"use client";

import { useState } from "react";
import { CONFIG } from "@/lib/config";
import { updateWork, formatarData, listMessages, sendMessage } from "@/lib/store";
import { gerarISBN, gerarDOI } from "@/lib/registros";
import { downloadTextFile, textoCartaAceite, textoCertificado, textoModeloQuestionario } from "@/lib/documentos";

export default function WorkCard({ work, onChange }) {
  const [mensagens, setMensagens] = useState(() => listMessages(work.id));
  const [novaMensagem, setNovaMensagem] = useState("");
  const etapas = CONFIG.etapasProcessoObra;
  const indexAtual = etapas.indexOf(work.etapaAtual);

  function refresh(patch) {
    const updated = updateWork(work.id, patch);
    onChange(updated);
  }

  function anexarArquivo(campo, file) {
    refresh({ arquivos: { ...work.arquivos, [campo]: file.name } });
  }

  function aprovarCapa() {
    refresh({ etapaAtual: "capa_aprovada" });
  }

  function aprovarEbook() {
    refresh({ etapaAtual: "prova_fisica_em_analise" });
  }

  function aprovarProvaFisica() {
    refresh({ etapaAtual: "aprovado_pelo_autor" });
  }

  function publicarObra(visibilidade, resumo) {
    const precisaIsbn = true; // toda obra individual recebe ISBN por padrão no protótipo
    const isbn = work.isbn || (precisaIsbn ? gerarISBN() : null);
    const doi = work.tipo === "coletanea" || work.desejaDoi ? work.doi || gerarDOI() : work.doi;
    refresh({
      etapaAtual: "publicado",
      visibilidade,
      resumo,
      isbn,
      doi,
      publicadoEm: new Date().toISOString(),
      certificadoGerado: true,
    });
  }

  function enviarMensagem() {
    if (!novaMensagem.trim()) return;
    const msg = sendMessage({ workId: work.id, autor: "Autor", texto: novaMensagem });
    setMensagens((m) => [...m, msg]);
    setNovaMensagem("");
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold">{work.titulo}</h3>
          <p className="text-sm text-black/60">
            {work.pacote} · Prazo: {formatarData(work.dataPrevista)}
          </p>
        </div>
        <span className="badge bg-worges/10 text-worges">
          {CONFIG.etapasLabels[work.etapaAtual]}
        </span>
      </div>

      {/* Linha do tempo */}
      <div className="mt-4 flex flex-wrap gap-2">
        {etapas.map((etapa, i) => (
          <span
            key={etapa}
            className={`badge text-xs ${
              i <= indexAtual ? "bg-worges text-white" : "bg-black/5 text-black/40"
            }`}
          >
            {i + 1}. {CONFIG.etapasLabels[etapa]}
          </span>
        ))}
      </div>

      {/* Documentos e ações do processo editorial */}
      <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
        <div className="border border-black/10 rounded-lg p-4">
          <p className="font-medium">Questionário do autor</p>
          <button
            className="btn-secondary mt-2 !py-1 !px-3 text-xs"
            onClick={() => downloadTextFile("modelo-questionario-worges.txt", textoModeloQuestionario())}
          >
            Baixar modelo para preencher
          </button>
        </div>

        <div className="border border-black/10 rounded-lg p-4">
          <p className="font-medium">Obra em Word (enviada)</p>
          <input
            type="file"
            className="mt-2 text-xs"
            onChange={(e) => e.target.files?.[0] && anexarArquivo("obraOriginal", e.target.files[0])}
          />
          {work.arquivos.obraOriginal && (
            <p className="text-xs text-green-700 mt-1">Anexado: {work.arquivos.obraOriginal}</p>
          )}
        </div>

        <div className="border border-black/10 rounded-lg p-4">
          <p className="font-medium">Capa do ebook</p>
          <p className="text-xs text-black/50">
            Anexe sua própria capa ou aguarde as 2 propostas da editora.
          </p>
          <input
            type="file"
            accept="image/*"
            className="mt-2 text-xs"
            onChange={(e) => e.target.files?.[0] && anexarArquivo("capaEscolhida", e.target.files[0])}
          />
          {work.arquivos.capaEscolhida && (
            <p className="text-xs text-green-700 mt-1">Capa: {work.arquivos.capaEscolhida}</p>
          )}
          {work.etapaAtual === "propostas_capa_enviadas" && (
            <button className="btn-secondary mt-2 !py-1 !px-3 text-xs" onClick={aprovarCapa}>
              Aprovar capa recebida da editora
            </button>
          )}
        </div>

        <div className="border border-black/10 rounded-lg p-4">
          <p className="font-medium">Ebook para análise</p>
          <p className="text-xs text-black/50">
            Revise o ebook e o arquivo de errata liberados pela editora.
          </p>
          {work.etapaAtual === "ebook_em_analise" && (
            <button className="btn-secondary mt-2 !py-1 !px-3 text-xs" onClick={aprovarEbook}>
              Aprovar ebook e seguir para prova física
            </button>
          )}
        </div>

        <div className="border border-black/10 rounded-lg p-4">
          <p className="font-medium">Prova física</p>
          <p className="text-xs text-black/50">
            Data prevista para apreciação: {formatarData(work.dataPrevista)}
          </p>
          {work.etapaAtual === "prova_fisica_em_analise" && (
            <button className="btn-secondary mt-2 !py-1 !px-3 text-xs" onClick={aprovarProvaFisica}>
              Aprovar prova física
            </button>
          )}
        </div>

        <div className="border border-black/10 rounded-lg p-4">
          <p className="font-medium">Carta de aceite / Certificado</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              className="btn-secondary !py-1 !px-3 text-xs"
              onClick={() => downloadTextFile(`carta-aceite-${work.id}.txt`, textoCartaAceite(work))}
            >
              Baixar carta de aceite
            </button>
            {work.etapaAtual === "publicado" && (
              <button
                className="btn-secondary !py-1 !px-3 text-xs"
                onClick={() => downloadTextFile(`certificado-${work.id}.txt`, textoCertificado(work))}
              >
                Baixar certificado de publicação
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Aprovação final e publicação */}
      {work.etapaAtual === "aprovado_pelo_autor" && (
        <div className="mt-6 border-t border-black/10 pt-4">
          <p className="font-medium text-sm">Como deseja disponibilizar a obra no site?</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <button className="btn-secondary" onClick={() => publicarObra("privado", work.resumo)}>
              Manter privado (só eu)
            </button>
            <button className="btn-secondary" onClick={() => publicarObra("vitrine_sem_download", work.resumo || "Obra publicada pela Editora Worges.")}>
              Mostrar na vitrine (sem download)
            </button>
            <button className="btn-primary" onClick={() => publicarObra("vitrine_com_download", work.resumo || "Obra publicada pela Editora Worges.")}>
              Mostrar na vitrine com download
            </button>
          </div>
        </div>
      )}

      {work.etapaAtual === "publicado" && (
        <div className="mt-6 border-t border-black/10 pt-4 text-sm">
          <p>
            <strong>Publicado em:</strong> {formatarData(work.publicadoEm)} ·{" "}
            <strong>ISBN:</strong> {work.isbn || "—"} {work.doi && <> · <strong>DOI:</strong> {work.doi}</>}
          </p>
        </div>
      )}

      {/* Mensagens */}
      <div className="mt-6 border-t border-black/10 pt-4">
        <p className="font-medium text-sm">Mensagens com a editora</p>
        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto text-sm">
          {mensagens.map((m) => (
            <p key={m.id} className={m.autor === "Autor" ? "text-right" : ""}>
              <span className={`inline-block rounded-lg px-3 py-1.5 ${m.autor === "Autor" ? "bg-worges text-white" : "bg-black/5"}`}>
                {m.texto}
              </span>
            </p>
          ))}
          {mensagens.length === 0 && <p className="text-black/40 text-xs">Nenhuma mensagem ainda.</p>}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            className="input"
            placeholder="Escreva sua mensagem…"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensagem()}
          />
          <button className="btn-secondary" onClick={enviarMensagem}>Enviar</button>
        </div>
      </div>
    </div>
  );
}
