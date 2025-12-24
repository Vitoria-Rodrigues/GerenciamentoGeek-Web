import { api } from "@/lib/axios.js";

export const apiListarFuncionarios = async () => {
  const response = await api.get("/funcionarios");
  return response.data;
};

export const apiCriarFuncionario = async (dados) => {
  const response = await api.post("/funcionarios", dados);
  return response.data;
};

export const apiAtualizarFuncionario = async (id, dados) => {
  const response = await api.put(`/funcionarios/${id}`, dados);
  return response.data;
};

export const apiExcluirFuncionario = async (id) => {
  const response = await api.delete(`/funcionarios/${id}`);
  return response.data;
};
