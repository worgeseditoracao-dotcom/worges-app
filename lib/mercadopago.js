// ============================================================================
// INTEGRAÇÃO COM MERCADO PAGO — VERSÃO SIMULADA (MOCK)
// ----------------------------------------------------------------------------
// Neste protótipo, o link de pagamento é gerado localmente (não é um link real
// do Mercado Pago) e a aprovação é simulada por um botão no painel do
// administrador ("Simular pagamento aprovado"), no lugar do webhook real.
//
// PARA PRODUÇÃO, troque `gerarLinkPagamentoMock` por uma chamada de API route
// (ex.: /app/api/mercadopago/create-preference/route.js) que usa o SDK oficial:
//
//   import { MercadoPagoConfig, Preference } from "mercadopago";
//   const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
//   const preference = await new Preference(client).create({ body: {
//     items: [{ title: quote.tituloObra, quantity: 1, unit_price: quote.total }],
//     back_urls: { success: ..., failure: ..., pending: ... },
//     notification_url: "https://seusite.com/api/mercadopago/webhook",
//   }});
//   // preference.init_point é o link real de checkout.
//
// E crie uma rota /app/api/mercadopago/webhook/route.js que recebe a
// notificação do Mercado Pago, confirma o pagamento via API e atualiza o
// orçamento/obra no banco de dados real (status "pago").
// ============================================================================

export function gerarLinkPagamentoMock(quote) {
  // Link fictício, apenas para demonstrar o fluxo no protótipo.
  return `https://checkout.mercadopago.com.br/mock/${quote.id}`;
}
