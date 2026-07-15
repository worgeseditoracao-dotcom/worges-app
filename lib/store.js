// ============================================================================
// "BANCO DE DADOS" DO PROTÓTIPO
// ----------------------------------------------------------------------------
// Este protótipo roda 100% no navegador, usando localStorage como banco de
// dados simulado. Isso permite testar todo o fluxo (orçamento, pagamento,
// processo editorial, publicação) sem precisar de servidor.
//
// PARA PRODUÇÃO: substitua as funções abaixo por chamadas reais a um backend
// (ex.: rotas /app/api/* do Next.js) conectado a um banco de dados real
// (Postgres/Supabase/MySQL) e à API oficial do Mercado Pago (webhooks).
// A assinatura das funções foi pensada para que essa troca seja simples.
// ============================================================================

const KEYS = {
  quotes: "worges_quotes",
  users: "worges_users",
  works: "worges_works",
  messages: "worges_messages",
  session: "worges_session",
};

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix = "") {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
}

// ---------------------------------------------------------------------------
// ORÇAMENTOS
// ---------------------------------------------------------------------------
export function listQuotes() {
  return read(KEYS.quotes, []);
}

export function saveQuote(quote) {
  const all = listQuotes();
  const withId = { id: uid("ORC-"), createdAt: new Date().toISOString(), status: "aguardando_pagamento", ...quote };
  write(KEYS.quotes, [withId, ...all]);
  return withId;
}

export function updateQuote(id, patch) {
  const all = listQuotes();
  const next = all.map((q) => (q.id === id ? { ...q, ...patch } : q));
  write(KEYS.quotes, next);
  return next.find((q) => q.id === id);
}

export function getQuote(id) {
  return listQuotes().find((q) => q.id === id) || null;
}

// ---------------------------------------------------------------------------
// USUÁRIOS (autores)
// ---------------------------------------------------------------------------
export function listUsers() {
  return read(KEYS.users, []);
}

export function findOrCreateUser({ nome, email, telefone }) {
  const all = listUsers();
  let user = all.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = { id: uid("USR-"), nome, email, telefone, createdAt: new Date().toISOString() };
    write(KEYS.users, [...all, user]);
  }
  return user;
}

export function getSession() {
  return read(KEYS.session, null);
}

export function setSession(user) {
  write(KEYS.session, user);
}

export function clearSession() {
  write(KEYS.session, null);
}

// ---------------------------------------------------------------------------
// OBRAS (livros e capítulos de coletânea, já pagos, em processo editorial)
// ---------------------------------------------------------------------------
export function listWorks() {
  return read(KEYS.works, []);
}

export function listWorksByUser(userId) {
  return listWorks().filter((w) => w.userId === userId);
}

export function createWorkFromQuote(quote) {
  const all = listWorks();
  const work = {
    id: uid("OBRA-"),
    quoteId: quote.id,
    userId: quote.userId,
    tipo: quote.tipo, // "livro" | "coletanea"
    titulo: quote.tituloObra,
    autor: quote.nome,
    pacote: quote.pacote,
    prazoDiasUteis: quote.prazoDiasUteis,
    dataPrevista: proximaDataUtil(quote.prazoDiasUteis),
    etapaAtual: "orcamento_pago",
    isbn: null,
    doi: null,
    resumo: "",
    visibilidade: "privado", // "privado" | "vitrine_sem_download" | "vitrine_com_download"
    arquivos: {
      obraOriginal: null,
      propostasCapa: [],
      capaEscolhida: null,
      ebookRevisado: null,
      arquivoErrata: null,
      obraFinal: null,
    },
    publicadoEm: null,
    cartaAceiteGerada: false,
    certificadoGerado: false,
    createdAt: new Date().toISOString(),
  };
  write(KEYS.works, [work, ...all]);
  return work;
}

export function updateWork(id, patch) {
  const all = listWorks();
  const next = all.map((w) => (w.id === id ? { ...w, ...patch } : w));
  write(KEYS.works, next);
  return next.find((w) => w.id === id);
}

export function getWork(id) {
  return listWorks().find((w) => w.id === id) || null;
}

export function listPublishedWorks() {
  return listWorks().filter((w) => w.visibilidade !== "privado" && w.etapaAtual === "publicado");
}

// ---------------------------------------------------------------------------
// MENSAGENS (canal autor <-> editora dentro do perfil)
// ---------------------------------------------------------------------------
export function listMessages(workId) {
  return read(KEYS.messages, []).filter((m) => m.workId === workId);
}

export function sendMessage({ workId, autor, texto }) {
  const all = read(KEYS.messages, []);
  const msg = { id: uid("MSG-"), workId, autor, texto, createdAt: new Date().toISOString() };
  write(KEYS.messages, [...all, msg]);
  return msg;
}

// ---------------------------------------------------------------------------
// HELPERS DE DATA
// ---------------------------------------------------------------------------
export function proximaDataUtil(diasUteis) {
  const data = new Date();
  let restantes = diasUteis;
  while (restantes > 0) {
    data.setDate(data.getDate() + 1);
    const diaSemana = data.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) restantes--;
  }
  return data.toISOString();
}

export function formatarData(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("pt-BR");
}

export { uid };
