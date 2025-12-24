// Fontawesome
import "@fortawesome/fontawesome-free/css/all.min.css";

// Identity
import logoIdentidade from "@/assets/svg/identidade/logo-identidade.svg?raw";
import logoPositiva from "@/assets/svg/identidade/logo-positiva.svg?raw";
import logoNegativa from "@/assets/svg/identidade/logo-negativa.svg?raw";
import logoPreencher from "@/assets/svg/identidade/logo-preencher.svg?raw";

// Icones customizados
import iconeCliente from "@/assets/svg/icones/cliente.svg?raw";
import iconeProduto from "@/assets/svg/icones/produto.svg?raw";
import iconeVenda from "@/assets/svg/icones/venda.svg?raw";
import iconeSair from "@/assets/svg/icones/sair.svg?raw";

const listaIcones = {
  icones: {
    funcionario: iconeCliente,
    cliente: iconeCliente,
    produto: iconeProduto,
    venda: iconeVenda,
    sair: iconeSair,
  },
  identidade: {
    "logo-positiva": logoPositiva,
    "logo-negativa": logoNegativa,
    "logo-identidade": logoIdentidade,
    "logo-preencher": logoPreencher,
  },
  fontawesome: {
    lupa: '<i class="fa-solid fa-magnifying-glass"></i>',
    adicionar: '<i class="fa-solid fa-plus"></i>',
    tabela: '<i class="fa-solid fa-table"></i>',
    lista: '<i class="fa-solid fa-table-list"></i>',
    casa: '<i class="fa-regular fa-house"></i>',
    fechar: '<i class="fa-solid fa-xmark"></i>',
  },
};

export default function InjetarIcones() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const [biblioteca, nome] = el.dataset.icon.split(":");
    const svg = listaIcones[biblioteca]?.[nome];
    if (svg) el.innerHTML = svg;
  });
}
