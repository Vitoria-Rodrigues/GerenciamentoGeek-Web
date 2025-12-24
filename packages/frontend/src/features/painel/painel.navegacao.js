import { animarEntradaTela } from "@/animacoes.js";

export const navegarPara = (app, id) => {
  app.dom.painel.listaTelas.forEach((s) => s.classList.add("escondido"));

  const alvo = document.getElementById(id);
  if (alvo) {
    alvo.classList.remove("escondido");
    animarEntradaTela(alvo);
  }
};

export const atualizarMenuAtivo = (app, elemento) => {
  app.dom.painel.listaItensMenu.forEach((i) => i.classList.remove("ativo"));
  elemento.classList.add("ativo");
};
