// ============================================================================
// GERAÇÃO DE DOCUMENTOS (Carta de Aceite, Certificado, Modelo de Questionário)
// ----------------------------------------------------------------------------
// Para manter o protótipo simples, os documentos são baixados como arquivos de
// texto (.txt). Para produção, recomenda-se gerar .docx reais com a
// biblioteca "docx" (npm) ou um template .docx preenchido via "docxtemplater",
// mantendo a formatação oficial da editora (timbrado, logo, assinatura etc.).
// ============================================================================

export function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function textoCartaAceite(work) {
  return `CARTA DE ACEITE

Editora Worges

A Editora Worges confirma o ACEITE da obra "${work.titulo}", de autoria de ${work.autor},
para publicação, referente ao pacote "${work.pacote}".

Prazo estimado de entrega: ${work.prazoDiasUteis} dias úteis.
Código da obra: ${work.id}
Data de emissão: ${new Date().toLocaleDateString("pt-BR")}

Esta carta é gerada automaticamente após a confirmação do pagamento e não
substitui o contrato/termo assinado entre as partes.

_________________________________
Editora Worges`;
}

export function textoCertificado(work) {
  return `CERTIFICADO DE PUBLICAÇÃO

Editora Worges

Certificamos que a obra "${work.titulo}", de autoria de ${work.autor},
foi publicada pela Editora Worges em ${new Date(work.publicadoEm).toLocaleDateString("pt-BR")}.

${work.isbn ? `ISBN: ${work.isbn}` : ""}
${work.doi ? `DOI: ${work.doi}` : ""}

Código da obra: ${work.id}

_________________________________
Editora Worges`;
}

export function textoModeloQuestionario() {
  return `EDITORA WORGES — QUESTIONÁRIO DO AUTOR

Preencha este questionário e envie para o e-mail da editora junto com sua obra
em Word.

1. Nome completo do autor:
2. Título da obra:
3. Breve resumo da obra (até 10 linhas):
4. Biografia do autor (até 8 linhas):
5. Palavras-chave (até 5):
6. Já possui capa? (sim/não):
7. Deseja ISBN? (sim/não):
8. Deseja DOI? (sim/não, aplicável a artigos/coletâneas):
9. Observações adicionais:
`;
}
