export const formatCurrency = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === "") return "";
  
  // Se já é uma string formatada, remove formatação primeiro
  let numValue: number;
  if (typeof value === "string") {
    // Remove tudo exceto números, vírgula e ponto
    const cleaned = value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
    numValue = parseFloat(cleaned);
  } else {
    numValue = value;
  }
  
  if (isNaN(numValue) || numValue === 0) return "";
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
};

export const unformatCurrency = (value: string): number => {
  if (!value) return 0;
  
  // Remove R$, espaços e outros caracteres, mantém apenas números, vírgula e ponto
  const cleaned = value
    .replace(/R\$/g, "")
    .replace(/\s/g, "")
    .replace(/\./g, "") // Remove pontos (separadores de milhar)
    .replace(",", "."); // Substitui vírgula por ponto para parseFloat
  
  const numValue = parseFloat(cleaned);
  
  return isNaN(numValue) ? 0 : numValue;
};
