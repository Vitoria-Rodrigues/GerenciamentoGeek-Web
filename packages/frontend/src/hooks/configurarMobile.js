export const configurarMobile = (app, idTela) => {
  if (!app.state.isMobile) return;

  const tela = document.getElementById(idTela);
  if (!tela || tela.dataset.mobileIniciado) return;

  const esq = tela.querySelector(".divisao-esquerda");
  const dir = tela.querySelector(".divisao-direita");

  if (!esq || !dir) return;

  const labelEsq =
    esq.querySelector(".container-titulo")?.innerText.trim() || "Cadastro";
  const labelDir =
    dir.querySelector(".container-titulo")?.innerText.trim() || "Lista";

  const header = document.createElement("div");
  header.className = "mobile-toggle-header";
  header.innerHTML = `
    <button class="btn-toggle-mobile ativo" data-alvo="esq">${labelEsq}</button>
    <button class="btn-toggle-mobile" data-alvo="dir">${labelDir}</button>
  `;

  tela.prepend(header);

  dir.classList.add("mobile-hidden");

  header.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-toggle-mobile");
    if (!btn) return;

    header
      .querySelectorAll(".btn-toggle-mobile")
      .forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");

    if (btn.dataset.alvo === "esq") {
      esq.classList.remove("mobile-hidden");
      dir.classList.add("mobile-hidden");
    } else {
      esq.classList.add("mobile-hidden");
      dir.classList.remove("mobile-hidden");
    }
  });

  tela.dataset.mobileIniciado = "true";
};
