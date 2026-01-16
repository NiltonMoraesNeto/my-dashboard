import api from "./api";

export interface ContaPagar {
  id: string;
  descricao: string;
  valor: number;
  vencimento: string;
  mes: number;
  ano: number;
  categoria?: string;
  status: string;
  unidadeId?: string;
  observacoes?: string;
  anexo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContaPagarDto {
  descricao: string;
  valor: number;
  vencimento: string;
  mes: number;
  ano: number;
  categoria?: string;
  status?: string;
  unidadeId?: string;
  observacoes?: string;
}

export interface UpdateContaPagarDto {
  descricao?: string;
  valor?: number;
  vencimento?: string;
  mes?: number;
  ano?: number;
  categoria?: string;
  status?: string;
  unidadeId?: string;
  observacoes?: string;
}

export interface ContasPagarListResponse {
  data: ContaPagar[];
  total: number;
  page: number;
  totalPages: number;
}

export const fetchContasPagarList = async (
  page: number = 1,
  totalItemsByPage: number = 10,
  mes?: number,
  ano?: number,
  condominioId?: string
): Promise<ContasPagarListResponse> => {
  try {
    const params: Record<string, string> = {
      page: page.toString(),
      totalItemsByPage: totalItemsByPage.toString(),
    };

    if (mes) {
      params.mes = mes.toString();
    }

    if (ano) {
      params.ano = ano.toString();
    }

    if (condominioId) {
      params.condominioId = condominioId;
    }

    const response = await api.get<ContasPagarListResponse>(
      "/condominio/contas-pagar",
      { params }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar contas a pagar:", error);
    throw error;
  }
};

export const fetchContaPagar = async (id: string): Promise<ContaPagar> => {
  try {
    const response = await api.get<ContaPagar>(`/condominio/contas-pagar/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar conta a pagar:", error);
    throw error;
  }
};

export const createContaPagar = async (
  data: CreateContaPagarDto,
  anexo?: File
): Promise<ContaPagar> => {
  try {
    const formData = new FormData();

    // Adicionar campos do formulário com conversão correta de tipos
    formData.append("descricao", data.descricao);
    formData.append("valor", data.valor.toString());
    formData.append("vencimento", data.vencimento);
    
    if (data.mes !== undefined) {
      formData.append("mes", data.mes.toString());
    }
    
    if (data.ano !== undefined) {
      formData.append("ano", data.ano.toString());
    }
    
    if (data.categoria) {
      formData.append("categoria", data.categoria);
    }
    
    if (data.status) {
      formData.append("status", data.status);
    }
    
    if (data.unidadeId) {
      formData.append("unidadeId", data.unidadeId);
    }
    
    if (data.observacoes) {
      formData.append("observacoes", data.observacoes);
    }

    // Adicionar arquivo se fornecido
    if (anexo) {
      formData.append("anexo", anexo);
    }

    const response = await api.post<ContaPagar>(
      "/condominio/contas-pagar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao criar conta a pagar:", error);
    throw error;
  }
};

export const updateContaPagar = async (
  id: string,
  data: UpdateContaPagarDto,
  anexo?: File
): Promise<ContaPagar> => {
  try {
    const formData = new FormData();

    // Adicionar campos do formulário com conversão correta de tipos
    if (data.descricao !== undefined) {
      formData.append("descricao", data.descricao);
    }
    
    if (data.valor !== undefined) {
      formData.append("valor", data.valor.toString());
    }
    
    if (data.vencimento !== undefined) {
      formData.append("vencimento", data.vencimento);
    }
    
    if (data.mes !== undefined) {
      formData.append("mes", data.mes.toString());
    }
    
    if (data.ano !== undefined) {
      formData.append("ano", data.ano.toString());
    }
    
    if (data.categoria !== undefined) {
      formData.append("categoria", data.categoria);
    }
    
    if (data.status !== undefined) {
      formData.append("status", data.status);
    }
    
    if (data.unidadeId !== undefined) {
      formData.append("unidadeId", data.unidadeId);
    }
    
    if (data.observacoes !== undefined) {
      formData.append("observacoes", data.observacoes);
    }

    // Adicionar arquivo se fornecido
    if (anexo) {
      formData.append("anexo", anexo);
    }

    const response = await api.patch<ContaPagar>(
      `/condominio/contas-pagar/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar conta a pagar:", error);
    throw error;
  }
};

export const deleteContaPagar = async (id: string): Promise<void> => {
  try {
    await api.delete(`/condominio/contas-pagar/${id}`);
  } catch (error) {
    console.error("Erro ao deletar conta a pagar:", error);
    throw error;
  }
};

export const downloadContaPagarAnexo = async (anexoPath: string) => {
  try {
    // O anexoPath já é o caminho relativo (ex: uploads/contas-pagar/arquivo.pdf)
    // Precisamos construir a URL completa usando a base da API
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const url = `${baseURL}/${anexoPath}`;
    
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao baixar anexo");
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = anexoPath.split("/").pop() || "anexo";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Erro ao baixar anexo:", error);
    throw error;
  }
};
