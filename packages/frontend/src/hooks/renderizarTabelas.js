export const renderizarTabelaClientes = (dados) => {
  const corpos = document.querySelectorAll('tbody[data-tipo-tabela="cliente"]');
  corpos.forEach((corpo) => {
    corpo.innerHTML = dados
      .map(
        (c) => `
      <tr class="linha-selecionavel" data-id="${c.id}">
        <td>${c.nome}</td>
        <td>${c.cpf}</td>
        <td>${c.sexo}</td>
        <td>${c.telefone}</td>
      </tr>
    `
      )
      .join("");
  });
};

export const renderizarTabelaFuncionarios = (dados) => {
  const corpos = document.querySelectorAll(
    'tbody[data-tipo-tabela="funcionario"]'
  );
  corpos.forEach((corpo) => {
    corpo.innerHTML = dados
      .map(
        (f) => `
      <tr class="linha-selecionavel" data-id="${f.id}">
        <td>${f.nome}</td>
        <td>${f.cpf}</td>
        <td>${f.cargo}</td>
        <td>${f.telefone}</td>
      </tr>
    `
      )
      .join("");
  });
};

export const renderizarTabelaProdutos = (dados) => {
  const corpos = document.querySelectorAll('tbody[data-tipo-tabela="produto"]');
  corpos.forEach((corpo) => {
    corpo.innerHTML = dados
      .map(
        (p) => `
      <tr class="linha-selecionavel" data-id="${p.id}">
        <td>${p.codigo}</td>
        <td>${p.nome}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
        <td>${p.qtdEstoque}</td>
      </tr>
    `
      )
      .join("");
  });
};

export const renderizarTabelaVendas = (dados) => {
  const corpos = document.querySelectorAll('tbody[data-tipo-tabela="venda"]');
  corpos.forEach((corpo) => {
    corpo.innerHTML = dados
      .map(
        (v) => `
      <tr>
        <td>${v.id}</td>
        <td>${new Date(v.data).toLocaleDateString("pt-BR")}</td>
        <td>R$ ${v.total.toFixed(2)}</td>
        <td>${v.cpfCliente}</td>
      </tr>
    `
      )
      .join("");
  });
};
