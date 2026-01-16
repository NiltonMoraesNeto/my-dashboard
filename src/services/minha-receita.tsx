interface CnaeSecundario {
  codigo: number;
  descricao: string;
}

interface QSAItem {
  pais?: string | null;
  nome_socio: string;
  codigo_pais?: string | null;
  faixa_etaria: string;
  cnpj_cpf_do_socio: string;
  qualificacao_socio: string;
  codigo_faixa_etaria: number;
  data_entrada_sociedade: string;
  identificador_de_socio: number;
  cpf_representante_legal?: string;
  nome_representante_legal?: string;
  codigo_qualificacao_socio: number;
  qualificacao_representante_legal?: string;
  codigo_qualificacao_representante_legal?: number;
}

interface MinhaReceitaResponse {
  cnpj: string;
  razao_social?: string;
  nome_fantasia?: string;
  descricao_situacao_cadastral?: string;
  data_situacao_cadastral?: string;
  descricao_identificador_matriz_filial?: string;
  data_inicio_atividade?: string;
  cnae_fiscal?: number;
  cnae_fiscal_descricao?: string;
  cnaes_secundarios?: CnaeSecundario[];
  natureza_juridica?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  uf?: string;
  municipio?: string;
  email?: string | null;
  ddd_telefone_1?: string;
  ddd_telefone_2?: string;
  capital_social?: number;
  codigo_porte?: number;
  porte?: string;
  opcao_pelo_simples?: boolean;
  data_opcao_pelo_simples?: string | null;
  opcao_pelo_mei?: boolean;
  data_opcao_pelo_mei?: string | null;
  qsa?: QSAItem[];
}

export const buscarCnpj = async (cnpj: string): Promise<MinhaReceitaResponse | null> => {
  try {
    // Remove caracteres não numéricos
    const cnpjLimpo = cnpj.replace(/\D/g, "");

    // Valida se tem 14 dígitos
    if (cnpjLimpo.length !== 14) {
      return null;
    }

    // Formata o CNPJ para a API (aceita com ou sem pontuação)
    // A API aceita: só números, com pontuação completa, ou com pontos e barra (sem hífen)
    const cnpjFormatado = `${cnpjLimpo.slice(0, 2)}.${cnpjLimpo.slice(2, 5)}.${cnpjLimpo.slice(5, 8)}/${cnpjLimpo.slice(8, 12)}-${cnpjLimpo.slice(12, 14)}`;

    // Usando a API pública do Minha Receita
    const response = await fetch(`https://minhareceita.org/${cnpjFormatado}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erro ao buscar CNPJ: ${response.status}`);
    }

    const data: MinhaReceitaResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar CNPJ:", error);
    return null;
  }
};
