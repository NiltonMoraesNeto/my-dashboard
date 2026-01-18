import api from "./api";

export interface Entrega {
  id: string;
  titulo: string;
  dataHora: string;
  nomeRecebedor: string;
  recebidoPor: string;
  unidadeId: string;
  anexo?: string;
  userId: string;
  empresaId?: string;
  createdAt: string;
  updatedAt: string;
  unidade?: {
    id: string;
    numero: string;
    bloco?: string;
    apartamento?: string;
  };
}

export interface CreateEntregaDto {
  titulo?: string;
  dataHora: string;
  nomeRecebedor: string;
  recebidoPor: "portaria" | "zelador" | "morador";
  unidadeId: string;
  anexo?: File;
}

export interface UpdateEntregaDto {
  titulo?: string;
  dataHora?: string;
  nomeRecebedor?: string;
  recebidoPor?: "portaria" | "zelador" | "morador";
  unidadeId?: string;
  anexo?: File;
}

export interface EntregasListResponse {
  data: Entrega[];
  total: number;
  page: number;
  totalPages: number;
}

export const fetchEntregasList = async (
  page: number = 1,
  totalItemsByPage: number = 10,
  unidadeId?: string,
  condominioId?: string
): Promise<EntregasListResponse> => {
  try {
    const params: Record<string, string> = {
      page: page.toString(),
      totalItemsByPage: totalItemsByPage.toString(),
    };

    if (unidadeId) {
      params.unidadeId = unidadeId;
    }

    if (condominioId) {
      params.condominioId = condominioId;
    }

    const response = await api.get<EntregasListResponse>(
      "/condominio/entregas",
      { params }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar entregas:", error);
    throw error;
  }
};

export const fetchEntrega = async (id: string): Promise<Entrega> => {
  try {
    const response = await api.get<Entrega>(`/condominio/entregas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar entrega:", error);
    throw error;
  }
};

export const createEntrega = async (
  data: CreateEntregaDto,
  anexo?: File
): Promise<Entrega> => {
  try {
    const formData = new FormData();
    formData.append("titulo", data.titulo || "Nova entrega");
    formData.append("dataHora", data.dataHora);
    formData.append("nomeRecebedor", data.nomeRecebedor);
    formData.append("recebidoPor", data.recebidoPor);
    formData.append("unidadeId", data.unidadeId);

    if (anexo) {
      formData.append("anexo", anexo);
    }

    const response = await api.post<Entrega>(
      "/condominio/entregas",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao criar entrega:", error);
    throw error;
  }
};

export const updateEntrega = async (
  id: string,
  data: UpdateEntregaDto,
  anexo?: File
): Promise<Entrega> => {
  try {
    const formData = new FormData();

    if (data.titulo !== undefined) {
      formData.append("titulo", data.titulo);
    }
    if (data.dataHora !== undefined) {
      formData.append("dataHora", data.dataHora);
    }
    if (data.nomeRecebedor !== undefined) {
      formData.append("nomeRecebedor", data.nomeRecebedor);
    }
    if (data.recebidoPor !== undefined) {
      formData.append("recebidoPor", data.recebidoPor);
    }
    if (data.unidadeId !== undefined) {
      formData.append("unidadeId", data.unidadeId);
    }

    if (anexo) {
      formData.append("anexo", anexo);
    }

    const response = await api.patch<Entrega>(
      `/condominio/entregas/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar entrega:", error);
    throw error;
  }
};

export const deleteEntrega = async (id: string): Promise<void> => {
  try {
    await api.delete(`/condominio/entregas/${id}`);
  } catch (error) {
    console.error("Erro ao deletar entrega:", error);
    throw error;
  }
};

export const downloadEntregaAnexo = async (id: string) => {
  try {
    const response = await api.get(`/condominio/entregas/${id}/download`, {
      responseType: "blob",
    });
    
    // Tentar extrair o nome do arquivo do header Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    let fileName = `anexo-entrega-${id}`;
    
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1].replace(/['"]/g, '');
      }
    }
    
    // Se não conseguiu extrair do header, tentar determinar pela extensão do Content-Type
    if (!fileName.includes('.')) {
      const contentType = response.headers['content-type'];
      let ext = '';
      if (contentType?.includes('image/jpeg')) {
        ext = '.jpg';
      } else if (contentType?.includes('image/png')) {
        ext = '.png';
      } else if (contentType?.includes('image/gif')) {
        ext = '.gif';
      } else if (contentType?.includes('image/webp')) {
        ext = '.webp';
      } else if (contentType?.includes('application/pdf')) {
        ext = '.pdf';
      }
      fileName = `${fileName}${ext}`;
    }
    
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Erro ao baixar anexo:", error);
    throw error;
  }
};
