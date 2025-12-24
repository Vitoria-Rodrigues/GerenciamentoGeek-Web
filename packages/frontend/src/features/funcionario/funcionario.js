import { cacheDOM } from "@/hooks/cacheDOM.js";
import {
  apiListarFuncionarios,
  apiCriarFuncionario,
  apiExcluirFuncionario,
  apiAtualizarFuncionario,
} from "./funcionario.api.js";
import { renderizarTabelaFuncionarios } from "@/hooks/renderizarTabelas.js";
import { validarFormulario } from "@/hooks/mascararInput.js";
import { configurarMobile } from "@/hooks/configurarMobile.js";

const seletores = {
  formulario: "#formulario-funcionario",
  botaoCadastrar: "#cadastrar-funcionario",
  corpoTabela: 'tbody[data-tabela-alvo="tabela-tela-funcionario"]',
  viewListagem: "#view-listagem-funcionario",
  viewEdicao: "#view-edicao-funcionario",
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

export const sincronizarFuncionarios = async (app) => {
  try {
    const resposta = await apiListarFuncionarios();
    app.state.funcionarios = resposta.data;
    renderizarTabelaFuncionarios(app.state.funcionarios);
  } catch (erro) {
    console.error("Erro ao sincronizar funcionários");
  }
};

export const iniciarFuncionario = async (app) => {
  app.dom.funcionario = cacheDOM(seletores);
  const { viewListagem, viewEdicao, corpoTabela, formulario, botaoCadastrar } =
    app.dom.funcionario;
  const btnEditar = viewListagem.querySelector("#btn-editar-funcionario");
  const btnExcluir = viewListagem.querySelector("#btn-excluir-funcionario");
  const formEdicao = viewEdicao.querySelector("#formulario-edicao-funcionario");
  const btnSalvar = viewEdicao.querySelector("#btn-salvar-edicao-funcionario");
  const btnCancelar = viewEdicao.querySelector(
    "#btn-cancelar-edicao-funcionario"
  );

  await sincronizarFuncionarios(app);
  configurarMobile(app, "tela-funcionario");

  const resetarEstado = () => {
    viewEdicao.classList.add("escondido");
    viewListagem.classList.remove("escondido");
    app.state.funcionarioSelecionado = null;
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
    app.state.funcionarioSelecionado = app.state.funcionarios.find(
      (f) => f.id == linha.dataset.id
    );
  };

  botaoCadastrar.onclick = async (e) => {
    e.preventDefault();
    if (!validarFormulario(formulario)) return;
    const dados = Object.fromEntries(new FormData(formulario));
    dados.cargo = Number(dados.cargo);
    try {
      const res = await apiCriarFuncionario(dados);
      alert(res.mensagem);
      formulario.reset();
      await sincronizarFuncionarios(app);
    } catch (erro) {
      alert(erro.response?.data?.mensagem || "Erro ao cadastrar");
    }
  };

  btnEditar.onclick = () => {
    if (!app.state.funcionarioSelecionado)
      return alert("Selecione um funcionário!");
    popularFormulario(formEdicao, app.state.funcionarioSelecionado);
    viewListagem.classList.add("escondido");
    viewEdicao.classList.remove("escondido");
  };

  btnSalvar.onclick = async () => {
    const dados = Object.fromEntries(new FormData(formEdicao));
    dados.cargo = Number(dados.cargo);
    try {
      const res = await apiAtualizarFuncionario(dados.id, dados);
      alert(res.mensagem);
      resetarEstado();
      await sincronizarFuncionarios(app);
    } catch (erro) {
      alert(erro.response?.data?.mensagem || "Erro ao atualizar");
    }
  };

  btnExcluir.onclick = async () => {
    if (!app.state.funcionarioSelecionado)
      return alert("Selecione um funcionário!");
    if (!confirm(`Excluir ${app.state.funcionarioSelecionado.nome}?`)) return;
    try {
      const res = await apiExcluirFuncionario(
        app.state.funcionarioSelecionado.id
      );
      alert(res.mensagem);
      resetarEstado();
      await sincronizarFuncionarios(app);
    } catch (erro) {
      alert(erro.response?.data?.mensagem || "Erro ao excluir");
    }
  };

  btnCancelar.onclick = resetarEstado;
};
