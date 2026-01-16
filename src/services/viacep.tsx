interface ViaCepApiResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  estado: string;
}

export const buscarCep = async (cep: string): Promise<ViaCepResponse | null> => {
  try {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, "");

    // Valida se tem 8 dígitos
    if (cepLimpo.length !== 8) {
      return null;
    }

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);

    if (!response.ok) {
      return null;
    }

    const data: ViaCepApiResponse = await response.json();

    // Verifica se o CEP foi encontrado
    if (data.erro) {
      return null;
    }

    // Padroniza o retorno
    return {
      cep: data.cep,
      logradouro: data.logradouro || "",
      complemento: data.complemento || "",
      bairro: data.bairro || "",
      cidade: data.localidade || "",
      uf: data.uf || "",
      estado: data.uf || "",
    };
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
};
