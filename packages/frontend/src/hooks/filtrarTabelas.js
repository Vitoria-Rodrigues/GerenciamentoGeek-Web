export const configurarFiltroTabela = () => {
  const inputsFiltro = document.querySelectorAll("[data-filtro-alvo]");

  inputsFiltro.forEach((input) => {
    const alvo = input.dataset.filtroAlvo;
    const tbody = document.querySelector(`tbody[data-tabela-alvo="${alvo}"]`);

    if (!tbody) return;

    input.addEventListener("input", () => {
      const termo = input.value.toLowerCase().trim();
      const linhas = tbody.querySelectorAll("tr");

      linhas.forEach((linha) => {
        const texto = linha.textContent.toLowerCase();
        linha.classList.toggle("escondido", !texto.includes(termo));
      });
    });
  });
};
