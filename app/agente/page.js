"use client";

import { useState } from "react";
import { useOrcamento } from "@/lib/useOrcamento";
import { CONFIG } from "@/lib/config";
import ResultadoOrcamento from "@/components/ResultadoOrcamento";

function Bubble({ children }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-8 h-8 rounded-full bg-worges text-white flex items-center justify-center text-xs font-bold shrink-0">
        W
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm border border-black/5 px-4 py-3 text-sm max-w-lg shadow-sm">
        {children}
      </div>
    </div>
  );
}

function UserBubble({ children }) {
  return (
    <div className="flex justify-end">
      <div className="bg-worges text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-lg">
        {children}
      </div>
    </div>
  );
}

export default function AgentePage() {
  const orc = useOrcamento();
  const [step, setStep] = useState("tipo"); // tipo -> pacote/capitulos -> arquivo -> contato -> resultado
  const [respostas, setRespostas] = useState([]);

  function registrarResposta(texto) {
    setRespostas((r) => [...r, texto]);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-serif font-bold">Assistente Editorial Worges</h1>
      <p className="text-sm text-black/60 mt-1">
        Tire suas dúvidas, envie sua obra e gere seu orçamento aqui mesmo.
      </p>

      <div className="mt-6 space-y-4">
        <Bubble>
          Olá! Eu sou o assistente editorial da Worges 👋 Vou te ajudar a gerar um
          orçamento válido para hoje. Sua publicação é um <strong>livro individual</strong> ou
          um <strong>capítulo de coletânea</strong>?
        </Bubble>

        {respostas[0] && <UserBubble>{respostas[0]}</UserBubble>}

        {step === "tipo" && (
          <div className="flex gap-3 pl-10">
            <button
              className="btn-secondary"
              onClick={() => {
                orc.setTipo("livro");
                registrarResposta("Livro individual");
                setStep("pacote");
              }}
            >
              Livro individual
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                orc.setTipo("coletanea");
                registrarResposta("Capítulo de coletânea");
                setStep("pacote");
              }}
            >
              Capítulo de coletânea
            </button>
          </div>
        )}

        {step !== "tipo" && orc.tipo === "livro" && (
          <>
            <Bubble>Ótimo! Qual pacote de serviços você prefere?</Bubble>
            {respostas[1] && <UserBubble>{respostas[1]}</UserBubble>}
          </>
        )}

        {step !== "tipo" && orc.tipo === "coletanea" && (
          <>
            <Bubble>Perfeito! Quantos capítulos você está enviando para esta coletânea?</Bubble>
            {respostas[1] && <UserBubble>{respostas[1]} capítulo(s)</UserBubble>}
          </>
        )}

        {step === "pacote" && orc.tipo === "livro" && (
          <div className="pl-10 grid sm:grid-cols-3 gap-3">
            {CONFIG.pacotesObra.map((p) => (
              <button
                key={p.chave}
                className="card !p-3 text-left hover:ring-2 hover:ring-worges"
                onClick={() => {
                  orc.setPacoteChave(p.chave);
                  registrarResposta(p.nome);
                  setStep("arquivo");
                }}
              >
                <p className="font-semibold text-sm">{p.nome}</p>
                <p className="text-xs text-black/50 mt-1">{p.descricao}</p>
              </button>
            ))}
          </div>
        )}

        {step === "pacote" && orc.tipo === "coletanea" && (
          <div className="pl-10 flex items-center gap-3">
            <input
              type="number"
              min={1}
              className="input max-w-[100px]"
              value={orc.numeroCapitulos}
              onChange={(e) => orc.setNumeroCapitulos(Number(e.target.value) || 1)}
            />
            <button
              className="btn-primary"
              onClick={() => {
                registrarResposta(String(orc.numeroCapitulos));
                setStep("arquivo");
              }}
            >
              Confirmar
            </button>
          </div>
        )}

        {step !== "tipo" && step !== "pacote" && (
          <>
            <Bubble>
              Agora envie o arquivo da sua obra em <strong>.docx</strong> para eu contar as
              páginas e calcular o valor.
            </Bubble>
            {respostas[2] && <UserBubble>📎 {respostas[2]}</UserBubble>}
          </>
        )}

        {step === "arquivo" && (
          <div className="pl-10 space-y-2">
            <input
              type="file"
              accept=".docx"
              className="input"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                await orc.processarArquivo(file);
                registrarResposta(file.name);
              }}
            />
            {orc.processandoArquivo && <p className="text-xs text-black/50">Lendo o arquivo…</p>}
            {orc.erroArquivo && <p className="text-xs text-red-600">{orc.erroArquivo}</p>}
            {orc.paginas && (
              <button className="btn-primary" onClick={() => setStep("contato")}>
                Continuar ({orc.paginas} página(s) identificadas)
              </button>
            )}
          </div>
        )}

        {(step === "contato" || step === "resultado") && (
          <>
            <Bubble>
              Encontrei <strong>{orc.paginas} página(s)</strong> ({orc.caracteres?.toLocaleString("pt-BR")}{" "}
              caracteres). Para gerar o orçamento, me diga: seu nome, o título da obra, seu
              e-mail e seu telefone/WhatsApp.
            </Bubble>
            {respostas[3] && <UserBubble>{respostas[3]}</UserBubble>}
          </>
        )}

        {step === "contato" && (
          <div className="pl-10 card !p-4 space-y-3">
            <input className="input" placeholder="Seu nome" value={orc.nome} onChange={(e) => orc.setNome(e.target.value)} />
            <input className="input" placeholder="Título da obra" value={orc.tituloObra} onChange={(e) => orc.setTituloObra(e.target.value)} />
            <input className="input" placeholder="E-mail" value={orc.email} onChange={(e) => orc.setEmail(e.target.value)} />
            <input className="input" placeholder="Telefone / WhatsApp" value={orc.telefone} onChange={(e) => orc.setTelefone(e.target.value)} />
            <button
              className="btn-primary w-full"
              disabled={!orc.nome || !orc.tituloObra || !orc.email || !orc.telefone}
              onClick={() => {
                registrarResposta(`${orc.nome} · ${orc.tituloObra} · ${orc.email} · ${orc.telefone}`);
                orc.gerarOrcamento();
                setStep("resultado");
              }}
            >
              Gerar meu orçamento
            </button>
          </div>
        )}

        {step === "resultado" && orc.resultado && (
          <>
            <Bubble>
              Prontinho! Aqui está seu orçamento, válido até hoje às 23h59. Depois do
              pagamento, crie seu login com este mesmo e-mail para acompanhar sua obra.
            </Bubble>
            <div className="pl-10">
              <ResultadoOrcamento resultado={orc.resultado} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
