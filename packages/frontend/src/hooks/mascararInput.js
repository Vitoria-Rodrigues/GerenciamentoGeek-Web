import IMask from "imask";

export const configurarMascarasGlobais = () => {
  const configs = {
    cpf: { mask: "000.000.000-00" },
    cep: { mask: "00000-000" },
    telefone: {
      mask: [{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }],
    },
    preco: {
      mask: "R$ num",
      blocks: {
        num: {
          mask: Number,
          thousandsSeparator: ".",
          padFractionalZeros: true,
          radix: ",",
        },
      },
    },
    quantidade: { mask: Number },
    codigo: { mask: Number },
    estoque: { mask: Number },
  };

  Object.keys(configs).forEach((name) => {
    document.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
      if (!input.dataset.masked) {
        input.mask = IMask(input, configs[name]);
        input.dataset.masked = "true";
      }
    });
  });
};

export const validarFormulario = (formulario) => {
  let valido = true;
  formulario.querySelectorAll("input").forEach((input) => {
    const mask = input.mask;
    if (!mask) return;

    const isRequired = input.hasAttribute("required");
    const isEmpty = mask.unmaskedValue.trim().length === 0;
    const isComplete = mask.masked.isComplete;

    if ((isRequired && isEmpty) || (!isEmpty && !isComplete)) {
      input.classList.add("erro-validacao");
      valido = false;
    } else {
      input.classList.remove("erro-validacao");
    }
  });
  return valido;
};
