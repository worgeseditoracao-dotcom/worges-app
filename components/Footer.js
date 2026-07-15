export default function Footer() {
  return (
    <footer className="border-t border-black/5 mt-16 py-8 text-sm text-black/50">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} Editora Worges. Todos os direitos reservados.</p>
        <p>Protótipo — dados de exemplo para validação de fluxo.</p>
      </div>
    </footer>
  );
}
