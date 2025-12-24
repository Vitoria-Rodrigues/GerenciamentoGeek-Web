import { api } from "@/lib/axios.js";

export const apiListarProdutos = async () => {
  const response = await api.get("/produtos");
  return response.data;
};

export const apiCriarProduto = async (dados) => {
  const response = await api.post("/produtos", dados);
  return response.data;
};

export const apiAtualizarProduto = async (id, dados) => {
  const response = await api.put(`/produtos/${id}`, dados);
  return response.data;
};

export const apiExcluirProduto = async (id) => {
  const response = await api.delete(`/produtos/${id}`);
  return response.data;
};

export const apiListarCategorias = async () => {
  const response = await api.get("/categorias");
  return response.data;
};

export const apiCriarCategoria = async (nomeCateg) => {
  const response = await api.post("/categorias", { nomeCateg });
  return response.data;
};
