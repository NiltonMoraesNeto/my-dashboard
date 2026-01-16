export const maskCpf = (value: string): string => {
  // Remove tudo que não é dígito
  const cpf = value.replace(/\D/g, "");

  // Aplica a máscara: 000.000.000-00
  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  } else if (cpf.length <= 9) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  } else {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
  }
};

export const unmaskCpf = (value: string): string => {
  return value.replace(/\D/g, "");
};
