// ============================================================================
// CONFIGURAÇÃO DE PREÇOS E REGRAS DO ORÇAMENTO — EDITORA WORGES
// ----------------------------------------------------------------------------
// Todos os valores abaixo são EXEMPLOS para o protótipo. Substitua pelos
// preços reais vigentes da editora. Este arquivo é o único lugar que precisa
// ser editado para atualizar a tabela de preços do site inteiro.
// ============================================================================

export const CONFIG = {
  // Quantas letras (caracteres, com espaços) equivalem a 1 "página editorial".
  // Norma comum no mercado editorial brasileiro: 1400 a 2100. Ajuste conforme
  // o padrão da Worges.
  caracteresPorPagina: 1800,

  // Preço por página, por serviço avulso.
  precoPorPaginaServico: {
    revisao_ortografica: 3.0,
    revisao_gramatical: 3.5,
    normalizacao_abnt: 4.0,
    diagramacao: 2.5,
    traducao: 12.0,
  },

  // Serviços com valor fixo (não dependem do número de páginas).
  servicosFixos: {
    isbn: 120,
    doi: 90,
    capa_2_propostas: 280,
    capa_extra: 90,
  },

  // Pacotes fechados para publicação de obra individual (livro).
  pacotesObra: [
    {
      chave: "essencial",
      nome: "Essencial",
      descricao: "Revisão ortográfica e gramatical + diagramação.",
      servicosInclusos: ["revisao_ortografica", "revisao_gramatical", "diagramacao"],
      taxaFixa: 0,
      incluiIsbn: false,
      incluiCapa: false,
      prazoDiasUteis: 20,
    },
    {
      chave: "profissional",
      nome: "Profissional",
      descricao: "Revisão completa + diagramação + normalização ABNT + ISBN + 2 propostas de capa.",
      servicosInclusos: ["revisao_ortografica", "revisao_gramatical", "normalizacao_abnt", "diagramacao"],
      taxaFixa: 150,
      incluiIsbn: true,
      incluiCapa: true,
      prazoDiasUteis: 30,
    },
    {
      chave: "premium",
      nome: "Premium",
      descricao: "Pacote Profissional + DOI + prioridade na fila editorial.",
      servicosInclusos: ["revisao_ortografica", "revisao_gramatical", "normalizacao_abnt", "diagramacao"],
      taxaFixa: 350,
      incluiIsbn: true,
      incluiCapa: true,
      incluiDoi: true,
      prazoDiasUteis: 15,
    },
  ],

  // Coletânea de artigos / capítulos.
  coletanea: {
    precoPorCapitulo: 90,
    isbnColetanea: 180,
    prazoDiasUteis: 25,
  },

  // Etapas do processo editorial de uma obra (usado no perfil do autor e no admin).
  etapasProcessoObra: [
    "orcamento_pago",
    "questionario_recebido",
    "revisao_em_andamento",
    "propostas_capa_enviadas",
    "capa_aprovada",
    "ebook_em_analise",
    "correcoes_autor",
    "prova_fisica_em_analise",
    "aprovado_pelo_autor",
    "publicado",
  ],

  etapasLabels: {
    orcamento_pago: "Orçamento pago",
    questionario_recebido: "Questionário recebido",
    revisao_em_andamento: "Revisão em andamento",
    propostas_capa_enviadas: "Propostas de capa enviadas",
    capa_aprovada: "Capa aprovada",
    ebook_em_analise: "Ebook em análise pelo autor",
    correcoes_autor: "Correções do autor em andamento",
    prova_fisica_em_analise: "Prova física em análise",
    aprovado_pelo_autor: "Aprovado pelo autor",
    publicado: "Publicado",
  },
};
