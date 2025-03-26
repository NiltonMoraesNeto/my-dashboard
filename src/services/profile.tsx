import api from "./api";

export const fetchProfileList = async () => {
  try {
    const response = await api.get("perfil");

    if (response.data) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Erro", error);
    return false;
  }
};

export const fetchProfileById = async (id: string) => {
  try {
    const response = await api.get("/perfil/filterById", {
      params: { id },
    });

    if (response.data) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Erro", error);
    return false;
  }
};
