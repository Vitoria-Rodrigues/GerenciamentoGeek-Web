import { api } from "@/lib/axios.js";

export const apiListarClientes = async () => {
  const response = await api.get("/clientes");
  return response.data;
};

export const apiCriarCliente = async (dados) => {
  const response = await api.post("/clientes", dados);
  return response.data;
};

export const apiAtualizarCliente = async (id, dados) => {
  const response = await api.put(`/clientes/${id}`, dados);
  return response.data;
};

export const apiExcluirCliente = async (id) => {
  const response = await api.delete(`/clientes/${id}`);
  return response.data;
};
