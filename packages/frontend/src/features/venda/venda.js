import { cacheDOM } from "@/hooks/cacheDOM.js";
import { apiCriarVenda, apiListarVendas } from "./venda.api.js";
import { renderizarTabelaVendas } from "@/hooks/renderizarTabelas.js";
import { sincronizarClientes } from "../cliente/cliente.js";
import { sincronizarProdutos } from "../produto/produto.js";
import { validarFormulario } from "@/hooks/mascararInput.js";
import { configurarMobile } from "@/hooks/configurarMobile.js";

const seletores = {
  formulario: "#formulario-venda",
  botaoCadastrar: "#cadastrar-venda",
  corpoClientes: 'tbody[data-tabela-alvo="tabela-cliente-tela-venda"]',
  corpoProdutos: 'tbody[data-tabela-alvo="tabela-produto-tela-venda"]',
};

export const sincronizarVendas = async (app) => {
  try {
    const resposta = await apiListarVendas();
    app.state.vendas = resposta.data;
    renderizarTabelaVendas(app.state.vendas);
  } catch (erro) {
    console.error("Erro ao sincronizar vendas");
  }
};

export const iniciarVenda = async (app) => {
  app.dom.venda = cacheDOM(seletores);
  const { formulario, botaoCadastrar, corpoClientes, corpoProdutos } =
    app.dom.venda;

  await Promise.all([
    sincronizarVendas(app),
    sincronizarClientes(app),
    sincronizarProdutos(app),
  ]);

  configurarMobile(app, "tela-venda");

  corpoClientes.onclick = (e) => {
    const linha = e.target.closest("tr");
    if (!linha) return;

    corpoClientes
      .querySelectorAll("tr")
      .forEach((tr) => tr.classList.remove("selecionado"));
    linha.classList.add("selecionado");

    const cliente = app.state.clientes.find((c) => c.id == linha.dataset.id);
    if (cliente) {
      const inputCpf = formulario.querySelector('input[name="cpf"]');
      if (inputCpf) {
        if (inputCpf.mask) inputCpf.mask.value = cliente.cpf;
        else inputCpf.value = cliente.cpf;
      }
    }
  };

  corpoProdutos.onclick = (e) => {
    const linha = e.target.closest("tr");
    if (!linha) return;

    corpoProdutos
      .querySelectorAll("tr")
      .forEach((tr) => tr.classList.remove("selecionado"));
    linha.classList.add("selecionado");

    const produto = app.state.produtos.find((p) => p.id == linha.dataset.id);
    if (produto) {
      const inputCodigo = formulario.querySelector('input[name="codigo"]');
      const inputPreco = formulario.querySelector('input[name="preco"]');

      if (inputCodigo) {
        if (inputCodigo.mask) inputCodigo.mask.value = String(produto.codigo);
        else inputCodigo.value = produto.codigo;
      }

      if (inputPreco) {
        if (inputPreco.mask) inputPreco.mask.typedValue = produto.preco;
        else inputPreco.value = produto.preco;
      }
    }
  };

  botaoCadastrar.onclick = async (e) => {
    e.preventDefault();
    if (!validarFormulario(formulario)) return;
    const raw = Object.fromEntries(new FormData(formulario));
    const produto = app.state.produtos.find((p) => p.codigo == raw.codigo);

    const dadosParaEnvio = {
      data: raw.formdata,
      total:
        parseFloat(raw.preco.replace(/[^0-9,]/g, "").replace(",", ".")) *
        parseInt(raw.quantidade),
      qtd: parseInt(raw.quantidade),
      cpfCliente: raw.cpf,
      idFuncionario: app.state.user.idFuncionario,
      formaPagamento: raw.pagamento,
      parcelasPagamento: parseInt(raw.parcelas),
      itemVenda: [
        {
          idProduto: parseInt(produto.id),
          qtdProduto: parseInt(raw.quantidade),
        },
      ],
    };

    try {
      const res = await apiCriarVenda(dadosParaEnvio);
      alert(res.mensagem);
      formulario.reset();
      corpoClientes
        .querySelectorAll("tr")
        .forEach((tr) => tr.classList.remove("selecionado"));
      corpoProdutos
        .querySelectorAll("tr")
        .forEach((tr) => tr.classList.remove("selecionado"));
      await Promise.all([sincronizarVendas(app), sincronizarProdutos(app)]);
    } catch (erro) {
      alert(erro.mensagem || "Erro ao realizar venda");
    }
  };
};
