import { CONFIG } from "./config";

// Estima o número de páginas editoriais a partir do texto extraído do .docx
export function estimarPaginas(textoCompleto) {
  const caracteres = (textoCompleto || "").replace(/\s+/g, " ").trim().length;
  const paginas = Math.max(1, Math.ceil(caracteres / CONFIG.caracteresPorPagina));
  return { caracteres, paginas };
}

// Calcula o orçamento de uma obra individual (livro)
export function calcularOrcamentoObra({ paginas, pacoteChave, servicosExtras = [] }) {
  const pacote = CONFIG.pacotesObra.find((p) => p.chave === pacoteChave);
  if (!pacote) throw new Error("Pacote inválido");

  const linhas = [];
  let total = 0;

  for (const servico of pacote.servicosInclusos) {
    const precoUnit = CONFIG.precoPorPaginaServico[servico];
    const valor = precoUnit * paginas;
    linhas.push({
      descricao: labelServico(servico),
      detalhe: `${paginas} págs x R$ ${precoUnit.toFixed(2)}`,
      valor,
    });
    total += valor;
  }

  if (pacote.taxaFixa) {
    linhas.push({ descricao: "Taxa do pacote", detalhe: pacote.nome, valor: pacote.taxaFixa });
    total += pacote.taxaFixa;
  }

  if (pacote.incluiIsbn) {
    linhas.push({ descricao: "ISBN", detalhe: "incluso no pacote", valor: CONFIG.servicosFixos.isbn });
    total += CONFIG.servicosFixos.isbn;
  }

  if (pacote.incluiCapa) {
    linhas.push({ descricao: "Capa (2 propostas)", detalhe: "incluso no pacote", valor: CONFIG.servicosFixos.capa_2_propostas });
    total += CONFIG.servicosFixos.capa_2_propostas;
  }

  if (pacote.incluiDoi) {
    linhas.push({ descricao: "DOI", detalhe: "incluso no pacote", valor: CONFIG.servicosFixos.doi });
    total += CONFIG.servicosFixos.doi;
  }

  for (const extra of servicosExtras) {
    if (CONFIG.servicosFixos[extra] != null) {
      linhas.push({ descricao: labelServico(extra), detalhe: "serviço extra", valor: CONFIG.servicosFixos[extra] });
      total += CONFIG.servicosFixos[extra];
    } else if (CONFIG.precoPorPaginaServico[extra] != null) {
      const precoUnit = CONFIG.precoPorPaginaServico[extra];
      const valor = precoUnit * paginas;
      linhas.push({ descricao: labelServico(extra), detalhe: `${paginas} págs x R$ ${precoUnit.toFixed(2)}`, valor });
      total += valor;
    }
  }

  return {
    pacote: pacote.nome,
    pacoteChave: pacote.chave,
    prazoDiasUteis: pacote.prazoDiasUteis,
    paginas,
    linhas,
    total: Math.round(total * 100) / 100,
  };
}

export function calcularOrcamentoColetanea({ paginas, numeroCapitulos = 1 }) {
  const linhas = [];
  let total = 0;

  const valorCapitulos = CONFIG.coletanea.precoPorCapitulo * numeroCapitulos;
  linhas.push({
    descricao: "Processamento editorial de capítulo(s)",
    detalhe: `${numeroCapitulos} capítulo(s) x R$ ${CONFIG.coletanea.precoPorCapitulo.toFixed(2)}`,
    valor: valorCapitulos,
  });
  total += valorCapitulos;

  linhas.push({ descricao: "ISBN da coletânea", detalhe: "por edição", valor: CONFIG.coletanea.isbnColetanea });
  total += CONFIG.coletanea.isbnColetanea;

  return {
    pacote: "Coletânea de artigos",
    pacoteChave: "coletanea",
    prazoDiasUteis: CONFIG.coletanea.prazoDiasUteis,
    paginas,
    linhas,
    total: Math.round(total * 100) / 100,
  };
}

export function labelServico(chave) {
  const labels = {
    revisao_ortografica: "Revisão ortográfica",
    revisao_gramatical: "Revisão gramatical/normativa",
    normalizacao_abnt: "Normalização ABNT",
    diagramacao: "Diagramação",
    traducao: "Tradução",
    isbn: "ISBN",
    doi: "DOI",
    capa_2_propostas: "Capa (2 propostas)",
    capa_extra: "Proposta de capa extra",
  };
  return labels[chave] || chave;
}

export function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function validadeOrcamentoHoje() {
  const hoje = new Date();
  const validade = new Date(hoje);
  validade.setHours(23, 59, 59, 999);
  return validade.toISOString();
}
