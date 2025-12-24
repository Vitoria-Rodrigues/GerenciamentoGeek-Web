export const validarPermissoes = (app) => {
  const cargo = app.state.user.cargo;
  const config = app.state.permissoes[cargo];

  if (!config) return null;

  app.dom.painel.listaItensMenu.forEach((item) => {
    const telaAlvo = item.dataset.target;
    if (!telaAlvo) return;

    item.style.display = config.telas.includes(telaAlvo) ? "flex" : "none";
  });

  return config.telas[0];
};

export const possuiAcesso = (app, tela, acao) => {
  const cargo = app.state.user.cargo;
  const config = app.state.permissoes[cargo];

  if (!config || !config.acoes[tela]) return false;

  return config.acoes[tela].includes(acao);
};
