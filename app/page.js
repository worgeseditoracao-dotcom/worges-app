import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-worges to-worges-dark text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Sua obra publicada com o cuidado que ela merece.
            </h1>
            <p className="mt-4 text-white/90 text-lg">
              A Editora Worges cuida de todo o processo editorial do seu livro
              ou artigo: revisão, diagramação, capa, ISBN, DOI e publicação.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/agente" className="btn-primary !bg-white !text-worges hover:!bg-white/90">
                Falar com o Assistente Editorial
              </Link>
              <Link href="/orcamento" className="btn-secondary !border-white !text-white hover:!bg-white/10">
                Gerar orçamento manual
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="aspect-square rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white/60 text-sm">
              [ilustração / capa de destaque]
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          {
            titulo: "Publicação de livros",
            texto: "Do manuscrito ao livro impresso e digital, com revisão, diagramação e capa profissional.",
            href: "/publicacoes",
          },
          {
            titulo: "Coletâneas de artigos",
            texto: "Organizamos edições coletivas com ISBN próprio e página individual para cada capítulo.",
            href: "/coletaneas",
          },
          {
            titulo: "Orçamento no mesmo dia",
            texto: "Envie seu arquivo em Word e receba um orçamento válido para o dia, calculado automaticamente.",
            href: "/agente",
          },
        ].map((item) => (
          <Link key={item.titulo} href={item.href} className="card hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-worges">{item.titulo}</h3>
            <p className="mt-2 text-sm text-black/60">{item.texto}</p>
          </Link>
        ))}
      </section>

      <section className="bg-white border-y border-black/5">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-serif font-bold text-center">Como funciona</h2>
          <ol className="mt-8 grid md:grid-cols-4 gap-6 text-sm">
            {[
              "Solicite um orçamento com o Assistente Editorial ou pelo formulário.",
              "Pague com segurança pelo link gerado automaticamente.",
              "Acompanhe cada etapa da obra no seu perfil: revisão, capa e ebook.",
              "Aprove a versão final e publique no site com ISBN e DOI.",
            ].map((texto, i) => (
              <li key={i} className="card">
                <span className="badge bg-worges/10 text-worges">Passo {i + 1}</span>
                <p className="mt-3">{texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
