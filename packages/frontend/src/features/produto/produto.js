import { cacheDOM } from "@/hooks/cacheDOM.js";
import {
  apiListarProdutos,
  apiCriarProduto,
  apiListarCategorias,
  apiCriarCategoria,
  apiExcluirProduto,
  apiAtualizarProduto,
} from "./produto.api.js";
import { renderizarTabelaProdutos } from "@/hooks/renderizarTabelas.js";
import { validarFormulario } from "@/hooks/mascararInput.js";
import { configurarMobile } from "@/hooks/configurarMobile.js";

const seletores = {
  formulario: "#formulario-produto",
  botaoCadastrar: "#cadastrar-produto",
  corpoTabela: 'tbody[data-tabela-alvo="tabela-tela-produto"]',
  viewListagem: "#view-listagem-produto",
  viewEdicao: "#view-edicao-produto",
};

const popularFormulario = (form, dados) => {
  Object.entries(dados).forEach(([key, value]) => {
    const campo = form.querySelector(`[name="${key}"]`);
    if (campo) {
      if (campo.mask) {
        if (key === "preco") campo.mask.typedValue = value;
        else campo.mask.value = String(value);
      } else {
        campo.value = value;
      }
    }
  });
};

export const sincronizarProdutos = async (app) => {
  try {
    const resposta = await apiListarProdutos();
    app.state.produtos = resposta.data;
    renderizarTabelaProdutos(app.state.produtos);
  } catch (erro) {
    console.error("Erro ao sincronizar produtos");
  }
};

const carregarCategorias = async (app) => {
  try {
    const resposta = await apiListarCategorias();
    const selects = document.querySelectorAll(
      ".select-categoria-geral, #select-categoria-produto"
    );

    selects.forEach((select) => {
      const isCadastro = select.id === "select-categoria-produto";
      select.innerHTML = isCadastro
        ? '<option value="">Selecione...</option><option value="nova-categoria">+ Nova categoria</option>'
        : '<option value="">Selecione...</option>';

      resposta.data.forEach((cat) => {
        select.innerHTML += `<option value="${cat.id}">${cat.nomeCateg}</option>`;
      });
    });
  } catch (erro) {
    console.error("Erro ao carregar categorias");
  }
};

export const iniciarProduto = async (app) => {
  app.dom.produto = cacheDOM(seletores);
  const { formulario, botaoCadastrar, corpoTabela, viewListagem, viewEdicao } =
    app.dom.produto;

  const btnEditar = viewListagem.querySelector("#btn-editar-produto");
  const btnExcluir = viewListagem.querySelector("#btn-excluir-produto");
  const formEdicao = viewEdicao.querySelector("#formulario-edicao-produto");
  const btnSalvar = viewEdicao.querySelector("#btn-salvar-edicao-produto");
  const btnCancelar = viewEdicao.querySelector("#btn-cancelar-edicao-produto");

  const selectCadastro = formulario.querySelector("#select-categoria-produto");
  const containerNova = formulario.querySelector("#container-nova-categoria");
  const inputNova = containerNova.querySelector("#input-nova-categoria");
  const btnConfirmaCat = containerNova.querySelector(
    "#btn-confirmar-categoria"
  );
  const btnCancelaCat = containerNova.querySelector("#btn-cancelar-categoria");

  await Promise.all([sincronizarProdutos(app), carregarCategorias(app)]);
  configurarMobile(app, "tela-produto");

  const resetarEstado = () => {
    viewEdicao.classList.add("escondido");
    viewListagem.classList.remove("escondido");
    app.state.produtoSelecionado = null;
    corpoTabela
      .querySelectorAll("tr")
      .forEach((tr) => tr.classList.remove("selecionado"));
  };

  corpoTabela.onclick = (e) => {
    const linha = e.target.closest("tr");
    if (!linha) return;
    corpoTabela
      .querySelectorAll("tr")
      .forEach((tr) => tr.classList.remove("selecionado"));
    linha.classList.add("selecionado");
    app.state.produtoSelecionado = app.state.produtos.find(
      (p) => p.id == linha.dataset.id
    );
  };

  if (selectCadastro) {
    selectCadastro.onchange = (e) => {
      if (e.target.value === "nova-categoria") {
        selectCadastro.classList.add("escondido");
        containerNova.classList.remove("escondido");
        inputNova.focus();
      }
    };
  }

  btnConfirmaCat.onclick = async () => {
    const nome = inputNova.value.trim();
    if (!nome) return alert("Digite o nome");
    try {
      const res = await apiCriarCategoria(nome);
      alert(res.mensagem);
      await carregarCategorias(app);
      containerNova.classList.add("escondido");
      selectCadastro.classList.remove("escondido");
      selectCadastro.value = "";
    } catch (erro) {
      alert("Erro ao criar categoria");
    }
  };

  btnCancelaCat.onclick = () => {
    containerNova.classList.add("escondido");
    selectCadastro.classList.remove("escondido");
    selectCadastro.value = "";
  };

  botaoCadastrar.onclick = async (e) => {
    e.preventDefault();
    if (!validarFormulario(formulario)) return;
    const raw = Object.fromEntries(new FormData(formulario));
    const dados = {
      codigo: parseInt(raw.codigo),
      nome: raw.nome,
      desc: raw.descricao,
      qtdEstoque: parseInt(raw.estoque),
      preco: parseFloat(raw.preco.replace(/[^0-9,]/g, "").replace(",", ".")),
      categoria: Number(raw.id_categoria),
    };
    try {
      const res = await apiCriarProduto(dados);
      alert(res.mensagem);
      formulario.reset();
      await sincronizarProdutos(app);
    } catch (erro) {
      alert(erro.response?.data?.mensagem || "Erro ao cadastrar");
    }
  };

  btnEditar.onclick = () => {
    if (!app.state.produtoSelecionado) return alert("Selecione um produto!");
    popularFormulario(formEdicao, app.state.produtoSelecionado);
    viewListagem.classList.add("escondido");
    viewEdicao.classList.remove("escondido");
  };

  btnSalvar.onclick = async () => {
    const raw = Object.fromEntries(new FormData(formEdicao));

    const dados = {
      id: raw.id,
      codigo: parseInt(raw.codigo),
      nome: raw.nome,
      desc: raw.descricao,
      qtdEstoque: parseInt(raw.estoque),
      preco: parseFloat(raw.preco.replace(/[^0-9,]/g, "").replace(",", ".")),
      categoria: Number(raw.id_categoria),
    };
    try {
      const res = await apiAtualizarProduto(dados.id, dados);
      alert(res.mensagem);
      resetarEstado();
      await sincronizarProdutos(app);
    } catch (erro) {
      alert(erro.response?.data?.mensagem || "Erro ao atualizar");
    }
  };

  btnExcluir.onclick = async () => {
    if (!app.state.produtoSelecionado) return alert("Selecione um produto!");
    if (!confirm(`Excluir ${app.state.produtoSelecionado.nome}?`)) return;
    try {
      const res = await apiExcluirProduto(app.state.produtoSelecionado.id);
      alert(res.mensagem);
      resetarEstado();
      await sincronizarProdutos(app);
    } catch (erro) {
      alert(erro.response?.data?.mensagem || "Erro ao excluir");
    }
  };

  btnCancelar.onclick = resetarEstado;
};
