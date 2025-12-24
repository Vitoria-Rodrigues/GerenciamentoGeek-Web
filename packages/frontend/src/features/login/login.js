import { apiLogin, apiLoginVerificar } from "./login.api.js";
import { cacheDOM } from "@/hooks/cacheDOM.js";
import { entrarNoPainel } from "../painel/painel.js";

const seletores = {
  formulario: "#formulario-login",
  botaoLogin: "#botao-login",
  telaLogin: "#tela-login",
};

export const iniciarLogin = (app) => {
  app.dom.login = cacheDOM(seletores);
  if (app.dom.login.formulario) {
    app.dom.login.formulario.onsubmit = async (e) => {
      e.preventDefault();
      await executarLogin(app);
    };
  }
};

export const executarLogin = async (app) => {
  const formData = new FormData(app.dom.login.formulario);
  const { login, senha } = Object.fromEntries(formData);
  try {
    const resposta = await apiLogin(login, senha);
    app.state.user = resposta.data;
    alert(resposta.mensagem);
    entrarNoPainel(app);
  } catch (erro) {
    alert(erro.mensagem || "Falha na autenticação");
  }
};

export const verificarSessao = async (app) => {
  const resposta = await apiLoginVerificar();
  if (resposta && resposta.status === "Sucesso") {
    app.state.user = resposta.data;
    entrarNoPainel(app);
  }
};

export const efetuarLogout = () => {
  localStorage.removeItem("@ggeek:token");
  localStorage.removeItem("@ggeek:user");
  window.location.reload();
};
