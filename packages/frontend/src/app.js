import injetarIcones from "@/hooks/injetarIcones.js";
import { iniciarLogin, verificarSessao } from "./features/login/login.js";
import { iniciarPainel } from "./features/painel/painel.js";
import permissoesConfig from "./permissoes.json";

import "@/main.css";
import "@/css/login.css";
import "@/css/painel.css";
import "@/css/sidebar.css";
import "@/css/responsividade-desktop.css";
import "@/css/responsividade-mobile.css";

const App = {
  state: {
    isMobile: window.innerWidth <= 768,
    user: null,
    permissoes: permissoesConfig,
    clientes: [],
    funcionarios: [],
    produtos: [],
    vendas: [],
    clienteSelecionado: null,
    funcionarioSelecionado: null,
    produtoSelecionado: null,
  },
  dom: {},
  iniciar() {
    injetarIcones();
    iniciarLogin(this);
    iniciarPainel(this);
    verificarSessao(this);
  },
};

App.iniciar();
