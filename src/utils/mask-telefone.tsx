export const maskTelefone = (value: string): string => {
  // Remove tudo que não é dígito
  const telefone = value.replace(/\D/g, "");

  // Aplica a máscara: (00) 00000-0000 ou (00) 0000-0000
  if (telefone.length <= 2) {
    return telefone.length > 0 ? `(${telefone}` : telefone;
  } else if (telefone.length <= 6) {
    return `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
  } else if (telefone.length <= 10) {
    // Telefone fixo: (00) 0000-0000
    return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 6)}-${telefone.slice(6)}`;
  } else {
    // Celular: (00) 00000-0000
    return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
  }
};

export const unmaskTelefone = (value: string): string => {
  return value.replace(/\D/g, "");
};
