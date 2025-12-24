import { cacheDOM } from "@/hooks/cacheDOM.js";
import {
  apiListarClientes,
  apiCriarCliente,
  apiExcluirCliente,
  apiAtualizarCliente,
} from "./cliente.api.js";
import { renderizarTabelaClientes } from "@/hooks/renderizarTabelas.js";
import { validarFormulario } from "@/hooks/mascararInput.js";
import { configurarMobile } from "@/hooks/configurarMobile.js";

const seletores = {
  formulario: "#formulario-cliente",
  botaoCadastrar: "#cadastrar-cliente",
  corpoTabela: 'tbody[data-tabela-alvo="tabela-tela-cliente"]',
  viewListagem: "#view-listagem-cliente",
  viewEdicao: "#view-edicao-cliente",
};

const popularFormulario = (form, dados) => {
  Object.entries(dados).forEach(([key, value]) => {
    const campo = form.querySelector(`[name="${key}"]`);
    if (campo) {
      if (campo.mask) campo.mask.value = String(value);
      else campo.value = value;
    }
  });
};

export const sincronizarClientes = async (app) => {
  try {
    const resposta = await apiListarClientes();
    app.state.clientes = resposta.data;
    renderizarTabelaClientes(app.state.clientes);
  } catch (erro) {
    console.error("Erro ao sincronizar clientes");
  }
};

export const iniciarCliente = async (app) => {
  app.dom.cliente = cacheDOM(seletores);
  const { viewListagem, viewEdicao, corpoTabela, formulario, botaoCadastrar } =
    app.dom.cliente;
  const btnEditar = viewListagem.querySelector("#btn-editar-cliente");
  const btnExcluir = viewListagem.querySelector("#btn-excluir-cliente");
  const formEdicao = viewEdicao.querySelector("#formulario-edicao-cliente");
  const btnSalvar = viewEdicao.querySelector("#btn-salvar-edicao");
  const btnCancelar = viewEdicao.querySelector("#btn-cancelar-edicao");

  await sincronizarClientes(app);
  configurarMobile(app, "tela-cliente");

  const resetarEstado = () => {
    viewEdicao.classList.add("escondido");
    viewListagem.classList.remove("escondido");
    app.state.clienteSelecionado = null;
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
    app.state.clienteSelecionado = app.state.clientes.find(
      (c) => c.id == linha.dataset.id
    );
  };

  botaoCadastrar.onclick = async (e) => {
    e.preventDefault();
    if (!validarFormulario(formulario)) return;
    try {
      const res = await apiCriarCliente(
        Object.fromEntries(new FormData(formulario))
      );
      alert(res.mensagem);
      formulario.reset();
      await sincronizarClientes(app);
    } catch (erro) {
      alert(erro.response?.data?.mensagem || "Erro ao cadastrar");
    }
  };

  btnEditar.onclick = () => {
    if (!app.state.clienteSelecionado) return alert("Selecione um cliente!");
    popularFormulario(formEdicao, app.state.clienteSelecionado);
    viewListagem.classList.add("escondido");
    viewEdicao.classList.remove("escondido");
  };

  btnSalvar.onclick = async () => {
    const dados = Object.fromEntries(new FormData(formEdicao));
    try {
      const res = await apiAtualizarCliente(dados.id, dados);
      alert(res.mensagem);
      resetarEstado();
      await sincronizarClientes(app);
    } catch (erro) {
      alert(erro.response?.data?.mensagem || "Erro ao atualizar");
    }
  };

  btnExcluir.onclick = async () => {
    if (!app.state.clienteSelecionado) return alert("Selecione um cliente!");
    if (!confirm(`Excluir ${app.state.clienteSelecionado.nome}?`)) return;
    try {
      const res = await apiExcluirCliente(app.state.clienteSelecionado.id);
      alert(res.mensagem);
      resetarEstado();
      await sincronizarClientes(app);
    } catch (erro) {
      alert(erro.response?.data?.mensagem || "Erro ao excluir");
    }
  };

  btnCancelar.onclick = resetarEstado;
};
