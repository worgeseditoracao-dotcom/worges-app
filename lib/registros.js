// ============================================================================
// GERADORES DE ISBN E DOI — VERSÃO SIMULADA (MOCK)
// ----------------------------------------------------------------------------
// O ISBN real é obtido junto à Agência Brasileira do ISBN (isbn.bn.gov.br) e o
// DOI junto a uma agência registradora (ex.: Crossref). Ambos exigem cadastro
// institucional da editora e, em geral, não têm API pública de geração
// instantânea — o fluxo real costuma ser: reservar um bloco de ISBNs com a
// editora previamente, e o sistema apenas atribui o próximo da lista.
//
// Aqui simulamos esse comportamento: cada chamada gera o "próximo" código
// disponível a partir de um contador salvo no localStorage, no formato correto
// (13 dígitos para ISBN, prefixo 10.xxxx para DOI).
// ============================================================================

const KEY_ISBN = "worges_isbn_counter";
const KEY_DOI = "worges_doi_counter";

// Prefixo de exemplo do editor (978-65-XXXXX). Substitua pelo prefixo real da Worges.
const PREFIXO_EDITORA_ISBN = "978-65-5900";
const PREFIXO_DOI = "10.65432/worges";

function nextCounter(key) {
  if (typeof window === "undefined") return 1;
  const atual = parseInt(window.localStorage.getItem(key) || "0", 10) + 1;
  window.localStorage.setItem(key, String(atual));
  return atual;
}

export function gerarISBN() {
  const n = nextCounter(KEY_ISBN);
  const sufixo = String(n).padStart(3, "0");
  const digitoVerificador = calcularDigitoVerificadorISBN(`${PREFIXO_EDITORA_ISBN}${sufixo}`.replace(/-/g, ""));
  return `${PREFIXO_EDITORA_ISBN}-${sufixo}-${digitoVerificador}`;
}

export function gerarDOI() {
  const n = nextCounter(KEY_DOI);
  return `${PREFIXO_DOI}.${String(n).padStart(5, "0")}`;
}

function calcularDigitoVerificadorISBN(digits) {
  // Cálculo padrão do dígito verificador de ISBN-13.
  const nums = digits.split("").map(Number);
  let soma = 0;
  for (let i = 0; i < nums.length; i++) {
    soma += nums[i] * (i % 2 === 0 ? 1 : 3);
  }
  const resto = soma % 10;
  return resto === 0 ? 0 : 10 - resto;
}
