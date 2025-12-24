import { api } from "@/lib/axios.js";

export const apiListarVendas = async () => {
  const response = await api.get("/vendas");
  return response.data;
};

export const apiCriarVenda = async (dados) => {
  const response = await api.post("/vendas", dados);
  return response.data;
};

export const apiBuscarVendasPorCpf = async (cpf) => {
  const response = await api.get(`/vendas/${cpf}`);
  return response.data;
};
