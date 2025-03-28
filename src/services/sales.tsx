import api from "./api";

export const fetchSalesByYear = async (year: number) => {
  try {
    const response = await api.get("/salesData/list", {
      params: { year },
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

export const fetchSalesByBuilding = async (buildingName: string) => {
  try {
    const response = await api.get("/salesDataByBuilding/list", {
      params: { buildingName },
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
