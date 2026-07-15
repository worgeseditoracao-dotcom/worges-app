"use client";

import { useState } from "react";
import { CONFIG } from "./config";
import { estimarPaginas, calcularOrcamentoObra, calcularOrcamentoColetanea, validadeOrcamentoHoje } from "./pricing";
import { saveQuote, findOrCreateUser } from "./store";
import { gerarLinkPagamentoMock } from "./mercadopago";

// Hook compartilhado entre a página de orçamento manual (/orcamento) e o
// Assistente Editorial em formato de chat (/agente). Toda a regra de negócio
// (extração do arquivo, contagem de páginas, cálculo do valor, geração do
// orçamento e do link de pagamento) fica centralizada aqui.
export function useOrcamento() {
  const [tipo, setTipo] = useState("livro"); // "livro" | "coletanea"
  const [pacoteChave, setPacoteChave] = useState(CONFIG.pacotesObra[0].chave);
  const [numeroCapitulos, setNumeroCapitulos] = useState(1);

  const [arquivo, setArquivo] = useState(null);
  const [paginas, setPaginas] = useState(null);
  const [caracteres, setCaracteres] = useState(null);
  const [processandoArquivo, setProcessandoArquivo] = useState(false);
  const [erroArquivo, setErroArquivo] = useState(null);

  const [nome, setNome] = useState("");
  const [tituloObra, setTituloObra] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const [resultado, setResultado] = useState(null);

  async function processarArquivo(file) {
    setErroArquivo(null);
    setProcessandoArquivo(true);
    setArquivo(file);
    try {
      const isDocx = file.name.toLowerCase().endsWith(".docx");
      if (!isDocx) {
        throw new Error("Envie o arquivo em formato .docx (Word).");
      }
      const mammothModule = await import("mammoth/mammoth.browser");
      const mammoth = mammothModule.default || mammothModule;
      const arrayBuffer = await file.arrayBuffer();
      const { value: texto } = await mammoth.extractRawText({ arrayBuffer });
      const { caracteres: qtdCaracteres, paginas: qtdPaginas } = estimarPaginas(texto);
      setCaracteres(qtdCaracteres);
      setPaginas(qtdPaginas);
    } catch (e) {
      setErroArquivo(e.message || "Não foi possível ler o arquivo.");
      setPaginas(null);
      setCaracteres(null);
    } finally {
      setProcessandoArquivo(false);
    }
  }

  function calcular() {
    if (!paginas) return null;
    const calc =
      tipo === "livro"
        ? calcularOrcamentoObra({ paginas, pacoteChave })
        : calcularOrcamentoColetanea({ paginas, numeroCapitulos });
    return calc;
  }

  function gerarOrcamento() {
    const calc = calcular();
    if (!calc) return null;

    const user = findOrCreateUser({ nome, email, telefone });

    const quote = saveQuote({
      userId: user.id,
      nome,
      tituloObra,
      email,
      telefone,
      tipo,
      arquivoNome: arquivo?.name || null,
      paginas: calc.paginas,
      pacote: calc.pacote,
      pacoteChave: calc.pacoteChave,
      prazoDiasUteis: calc.prazoDiasUteis,
      linhas: calc.linhas,
      total: calc.total,
      validoAte: validadeOrcamentoHoje(),
    });

    const linkPagamento = gerarLinkPagamentoMock(quote);
    const quoteComLink = { ...quote, linkPagamento };

    setResultado(quoteComLink);
    return quoteComLink;
  }

  function reset() {
    setArquivo(null);
    setPaginas(null);
    setCaracteres(null);
    setErroArquivo(null);
    setNome("");
    setTituloObra("");
    setEmail("");
    setTelefone("");
    setResultado(null);
  }

  return {
    tipo, setTipo,
    pacoteChave, setPacoteChave,
    numeroCapitulos, setNumeroCapitulos,
    arquivo, paginas, caracteres, processandoArquivo, erroArquivo, processarArquivo,
    nome, setNome, tituloObra, setTituloObra, email, setEmail, telefone, setTelefone,
    resultado, calcular, gerarOrcamento, reset,
  };
}
