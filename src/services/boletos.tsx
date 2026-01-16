import { isSuccessRequest } from "../utils/response-request";
import api from "./api";

interface CreateBoletoPayload {
  unidadeId: string;
  descricao: string;
  valor: number;
  vencimento: string;
  arquivo?: File;
  status?: string;
  dataPagamento?: string;
  observacoes?: string;
}

export interface UpdateBoletoPayload {
  unidadeId?: string;
  descricao?: string;
  valor?: number;
  vencimento?: string;
  arquivo?: File;
  status?: string;
  dataPagamento?: string;
  observacoes?: string;
}

export const createBoleto = async (payload: CreateBoletoPayload) => {
  try {
    const formData = new FormData();
    formData.append("unidadeId", payload.unidadeId);
    formData.append("descricao", payload.descricao);
    formData.append("valor", payload.valor.toString());
    formData.append("vencimento", payload.vencimento);
    
    if (payload.arquivo) {
      formData.append("arquivo", payload.arquivo);
    }
    
    if (payload.status) {
      formData.append("status", payload.status);
    }
    
    if (payload.dataPagamento) {
      formData.append("dataPagamento", payload.dataPagamento);
    }
    
    if (payload.observacoes) {
      formData.append("observacoes", payload.observacoes);
    }

    const response = await api.post("/condominio/boletos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Erro ao criar boleto:", error);
    throw error;
  }
};

export const fetchBoletoById = async (id: string) => {
  try {
    const response = await api.get(`/condominio/boletos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar boleto:", error);
    throw error;
  }
};

export const updateBoleto = async (
  id: string,
  payload: UpdateBoletoPayload
) => {
  try {
    const formData = new FormData();
    
    if (payload.unidadeId) {
      formData.append("unidadeId", payload.unidadeId);
    }
    
    if (payload.descricao) {
      formData.append("descricao", payload.descricao);
    }
    
    if (payload.valor !== undefined) {
      formData.append("valor", payload.valor.toString());
    }
    
    if (payload.vencimento) {
      formData.append("vencimento", payload.vencimento);
    }
    
    if (payload.arquivo) {
      formData.append("arquivo", payload.arquivo);
    }
    
    if (payload.status) {
      formData.append("status", payload.status);
    }
    
    if (payload.dataPagamento) {
      formData.append("dataPagamento", payload.dataPagamento);
    }
    
    if (payload.observacoes) {
      formData.append("observacoes", payload.observacoes);
    }

    const response = await api.patch(`/condominio/boletos/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Erro ao atualizar boleto:", error);
    throw error;
  }
};

export const fetchBoletosList = async (
  page: number,
  totalItemsByPage: number,
  unidadeId?: string,
  mes?: number,
  ano?: number,
  condominioId?: string
) => {
  try {
    const params: {
      page: number;
      totalItemsByPage: number;
      unidadeId?: string;
      mes?: number;
      ano?: number;
      condominioId?: string;
    } = { page, totalItemsByPage };
    if (unidadeId) params.unidadeId = unidadeId;
    if (mes) params.mes = mes;
    if (ano) params.ano = ano;
    if (condominioId) params.condominioId = condominioId;

    const response = await api.get("/condominio/boletos", { params });

    if (response.data) {
      return response.data;
    }
    return false;
  } catch (error) {
    console.error("Erro ao buscar boletos:", error);
    return false;
  }
};

export const downloadBoletoPdf = async (id: string) => {
  try {
    const response = await api.get(`/condominio/boletos/${id}/download`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    console.error("Erro ao baixar PDF do boleto:", error);
    throw error;
  }
};

export const deleteBoleto = async (id: string) => {
  try {
    const response = await api.delete(`/condominio/boletos/${id}`);

    if (isSuccessRequest(response.status)) {
      return response;
    }
    return false;
  } catch (error) {
    console.error("Erro ao deletar o boleto", error);
    throw error;
  }
};
