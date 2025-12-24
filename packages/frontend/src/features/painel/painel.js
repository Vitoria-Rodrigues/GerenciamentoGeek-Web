import { cacheDOM } from "@/hooks/cacheDOM.js";
import { navegarPara, atualizarMenuAtivo } from "./painel.navegacao.js";
import { efetuarLogout } from "../login/login.js";
import { animarSaidaLogin } from "@/animacoes.js";
import { validarPermissoes } from "@/hooks/gerenciadorDePermissoes.js";
import { iniciarCliente } from "../cliente/cliente.js";
import { iniciarFuncionario } from "../funcionario/funcionario.js";
import { iniciarProduto } from "../produto/produto.js";
import { iniciarVenda } from "../venda/venda.js";
import { configurarMascarasGlobais } from "@/hooks/mascararInput.js";
import { configurarFiltroTabela } from "@/hooks/filtrarTabelas.js";

const seletores = {
  janelaPainel: "#painel",
  sidebar: ".sidebar",
  listaItensMenu: ".menu-item",
  listaTelas: ".tela",
  botaoSair: "#botao-sair",
};

export const iniciarPainel = (app) => {
  app.dom.painel = cacheDOM(seletores);

  if (app.dom.painel.botaoSair) {
    app.dom.painel.botaoSair.addEventListener("click", (e) => {
      e.preventDefault();
      efetuarLogout();
    });
  }

  app.dom.painel.listaItensMenu.forEach((item) => {
    item.addEventListener("click", (e) => {
      const telaId = item.dataset.target;
      if (!telaId) return;

      e.preventDefault();
      navegarPara(app, telaId);
      atualizarMenuAtivo(app, item);
    });
  });
};

export const entrarNoPainel = (app) => {
  const primeiraTela = validarPermissoes(app);

  animarSaidaLogin(app.dom.login.telaLogin, () => {
    app.dom.login.telaLogin.classList.add("escondido");
    app.dom.painel.janelaPainel.classList.remove("escondido");

    iniciarCliente(app);
    iniciarFuncionario(app);
    iniciarProduto(app);
    iniciarVenda(app);

    configurarFiltroTabela();
    configurarMascarasGlobais();
    navegarPara(app, primeiraTela);

    const menuAtivo = Array.from(app.dom.painel.listaItensMenu).find(
      (i) => i.dataset.target === primeiraTela
    );
    if (menuAtivo) atualizarMenuAtivo(app, menuAtivo);
  });
};
