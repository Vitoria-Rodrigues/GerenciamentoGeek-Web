import { api } from "@/lib/axios.js";

export const apiLogin = async (login, senha) => {
  try {
    const response = await api.post("/login", { login, senha });
    if (response.data.data && response.data.data.token) {
      localStorage.setItem("@ggeek:token", response.data.data.token);
      localStorage.setItem("@ggeek:user", JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { status: "Erro", mensagem: "Erro de conexão" }
    );
  }
};

export const apiLoginVerificar = async () => {
  const token = localStorage.getItem("@ggeek:token");
  if (!token) return null;
  try {
    const response = await api.get("/login/verify");
    return response.data;
  } catch (error) {
    localStorage.removeItem("@ggeek:token");
    localStorage.removeItem("@ggeek:user");
    return null;
  }
};
